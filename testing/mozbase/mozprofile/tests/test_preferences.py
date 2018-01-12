#!/usr/bin/env python

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.

from __future__ import absolute_import

import mozfile
import mozhttpd
import os
import shutil
import tempfile
import unittest

import mozunit

from mozprofile.cli import MozProfileCLI
from mozprofile.prefs import Preferences
from mozprofile.profile import Profile

here = os.path.dirname(os.path.abspath(__file__))


class PreferencesTest(unittest.TestCase):
    """test mozprofile preference handling"""

    # preferences from files/prefs_with_comments.js
    _prefs_with_comments = {'browser.startup.homepage': 'http://planet.mozilla.org',
                            'zoom.minPercent': 30,
                            'zoom.maxPercent': 300,
                            'webgl.verbose': 'false'}

    def run_command(self, *args):
        """
        invokes mozprofile command line via the CLI factory
        - args : command line arguments (equivalent of sys.argv[1:])
        """

        # instantiate the factory
        cli = MozProfileCLI(list(args))

        # create the profile
        profile = cli.profile()

        # return path to profile
        return profile.profile

    def compare_generated(self, _prefs, commandline):
        """
        writes out to a new profile with mozprofile command line
        reads the generated preferences with prefs.py
        compares the results
        cleans up
        """
        profile = self.run_command(*commandline)
        prefs_file = os.path.join(profile, 'user.js')
        self.assertTrue(os.path.exists(prefs_file))
        read = Preferences.read_prefs(prefs_file)
        if isinstance(_prefs, dict):
            read = dict(read)
        self.assertEqual(_prefs, read)
        shutil.rmtree(profile)

    def test_basic_prefs(self):
        """test setting a pref from the command line entry point"""

        _prefs = {"browser.startup.homepage": "http://planet.mozilla.org/"}
        commandline = []
        _prefs = _prefs.items()
        for pref, value in _prefs:
            commandline += ["--pref", "%s:%s" % (pref, value)]
        self.compare_generated(_prefs, commandline)

    def test_ordered_prefs(self):
        """ensure the prefs stay in the right order"""
        _prefs = [("browser.startup.homepage", "http://planet.mozilla.org/"),
                  ("zoom.minPercent", 30),
                  ("zoom.maxPercent", 300),
                  ("webgl.verbose", 'false')]
        commandline = []
        for pref, value in _prefs:
            commandline += ["--pref", "%s:%s" % (pref, value)]
        _prefs = [(i, Preferences.cast(j)) for i, j in _prefs]
        self.compare_generated(_prefs, commandline)

    def test_ini(self):

        # write the .ini file
        _ini = """[DEFAULT]
browser.startup.homepage = http://planet.mozilla.org/

[foo]
browser.startup.homepage = http://github.com/
"""
        try:
            fd, name = tempfile.mkstemp(suffix='.ini')
            os.write(fd, _ini)
            os.close(fd)
            commandline = ["--preferences", name]

            # test the [DEFAULT] section
            _prefs = {'browser.startup.homepage': 'http://planet.mozilla.org/'}
            self.compare_generated(_prefs, commandline)

            # test a specific section
            _prefs = {'browser.startup.homepage': 'http://github.com/'}
            commandline[-1] = commandline[-1] + ':foo'
            self.compare_generated(_prefs, commandline)

        finally:
            # cleanup
            os.remove(name)

    def test_ini_keep_case(self):
        """
        Read a preferences config file with a preference in camel-case style.
        Check that the read preference name has not been lower-cased
        """
        # write the .ini file
        _ini = """[DEFAULT]
general.warnOnAboutConfig = False
"""
        try:
            fd, name = tempfile.mkstemp(suffix='.ini')
            os.write(fd, _ini)
            os.close(fd)
            commandline = ["--preferences", name]

            # test the [DEFAULT] section
            _prefs = {'general.warnOnAboutConfig': 'False'}
            self.compare_generated(_prefs, commandline)

        finally:
            # cleanup
            os.remove(name)

    def test_reset_should_remove_added_prefs(self):
        """Check that when we call reset the items we expect are updated"""
        profile = Profile()
        prefs_file = os.path.join(profile.profile, 'user.js')

        # we shouldn't have any initial preferences
        initial_prefs = Preferences.read_prefs(prefs_file)
        self.assertFalse(initial_prefs)
        initial_prefs = file(prefs_file).read().strip()
        self.assertFalse(initial_prefs)

        # add some preferences
        prefs1 = [("mr.t.quotes", "i aint getting on no plane!")]
        profile.set_preferences(prefs1)
        self.assertEqual(prefs1, Preferences.read_prefs(prefs_file))
        lines = file(prefs_file).read().strip().splitlines()
        self.assertTrue(any(line.startswith('#MozRunner Prefs Start') for line in lines))
        self.assertTrue(any(line.startswith('#MozRunner Prefs End') for line in lines))

        profile.reset()
        self.assertNotEqual(prefs1,
                            Preferences.read_prefs(os.path.join(profile.profile, 'user.js')),
                            "I pity the fool who left my pref")

    def test_reset_should_keep_user_added_prefs(self):
        """Check that when we call reset the items we expect are updated"""
        profile = Profile()
        prefs_file = os.path.join(profile.profile, 'user.js')

        # we shouldn't have any initial preferences
        initial_prefs = Preferences.read_prefs(prefs_file)
        self.assertFalse(initial_prefs)
        initial_prefs = file(prefs_file).read().strip()
        self.assertFalse(initial_prefs)

        # add some preferences
        prefs1 = [("mr.t.quotes", "i aint getting on no plane!")]
        profile.set_persistent_preferences(prefs1)
        self.assertEqual(prefs1, Preferences.read_prefs(prefs_file))
        lines = file(prefs_file).read().strip().splitlines()
        self.assertTrue(any(line.startswith('#MozRunner Prefs Start') for line in lines))
        self.assertTrue(any(line.startswith('#MozRunner Prefs End') for line in lines))

        profile.reset()
        self.assertEqual(prefs1,
                         Preferences.read_prefs(os.path.join(profile.profile, 'user.js')),
                         "I pity the fool who left my pref")

    def test_magic_markers(self):
        """ensure our magic markers are working"""

        profile = Profile()
        prefs_file = os.path.join(profile.profile, 'user.js')

        # we shouldn't have any initial preferences
        initial_prefs = Preferences.read_prefs(prefs_file)
        self.assertFalse(initial_prefs)
        initial_prefs = file(prefs_file).read().strip()
        self.assertFalse(initial_prefs)

        # add some preferences
        prefs1 = [("browser.startup.homepage", "http://planet.mozilla.org/"),
                  ("zoom.minPercent", 30)]
        profile.set_preferences(prefs1)
        self.assertEqual(prefs1, Preferences.read_prefs(prefs_file))
        lines = file(prefs_file).read().strip().splitlines()
        self.assertTrue(bool([line for line in lines
                              if line.startswith('#MozRunner Prefs Start')]))
        self.assertTrue(bool([line for line in lines
                              if line.startswith('#MozRunner Prefs End')]))

        # add some more preferences
        prefs2 = [("zoom.maxPercent", 300),
                  ("webgl.verbose", 'false')]
        profile.set_preferences(prefs2)
        self.assertEqual(prefs1 + prefs2, Preferences.read_prefs(prefs_file))
        lines = file(prefs_file).read().strip().splitlines()
        self.assertTrue(len([line for line in lines
                             if line.startswith('#MozRunner Prefs Start')]) == 2)
        self.assertTrue(len([line for line in lines
                             if line.startswith('#MozRunner Prefs End')]) == 2)

        # now clean it up
        profile.clean_preferences()
        final_prefs = Preferences.read_prefs(prefs_file)
        self.assertFalse(final_prefs)
        lines = file(prefs_file).read().strip().splitlines()
        self.assertTrue('#MozRunner Prefs Start' not in lines)
        self.assertTrue('#MozRunner Prefs End' not in lines)

    def test_preexisting_preferences(self):
        """ensure you don't clobber preexisting preferences"""

        # make a pretend profile
        tempdir = tempfile.mkdtemp()

        try:
            # make a user.js
            contents = """
user_pref("webgl.enabled_for_all_sites", true);
user_pref("webgl.force-enabled", true);
"""
            user_js = os.path.join(tempdir, 'user.js')
            f = file(user_js, 'w')
            f.write(contents)
            f.close()

            # make sure you can read it
            prefs = Preferences.read_prefs(user_js)
            original_prefs = [('webgl.enabled_for_all_sites', True), ('webgl.force-enabled', True)]
            self.assertTrue(prefs == original_prefs)

            # now read this as a profile
            profile = Profile(tempdir, preferences={"browser.download.dir": "/home/jhammel"})

            # make sure the new pref is now there
            new_prefs = original_prefs[:] + [("browser.download.dir", "/home/jhammel")]
            prefs = Preferences.read_prefs(user_js)
            self.assertTrue(prefs == new_prefs)

            # clean up the added preferences
            profile.cleanup()
            del profile

            # make sure you have the original preferences
            prefs = Preferences.read_prefs(user_js)
            self.assertTrue(prefs == original_prefs)
        finally:
            shutil.rmtree(tempdir)

    def test_can_read_prefs_with_multiline_comments(self):
        """
        Ensure that multiple comments in the file header do not break reading
        the prefs (https://bugzilla.mozilla.org/show_bug.cgi?id=1233534).
        """
        user_js = tempfile.NamedTemporaryFile(suffix='.js', delete=False)
        self.addCleanup(mozfile.remove, user_js.name)
        with user_js:
            user_js.write("""
# Mozilla User Preferences

/* Do not edit this file.
 *
 * If you make changes to this file while the application is running,
 * the changes will be overwritten when the application exits.
 *
 * To make a manual change to preferences, you can visit the URL about:config
 */

user_pref("webgl.enabled_for_all_sites", true);
user_pref("webgl.force-enabled", true);
""")
        self.assertEqual(
            Preferences.read_prefs(user_js.name),
            [('webgl.enabled_for_all_sites', True),
             ('webgl.force-enabled', True)]
        )

    def test_json(self):
        _prefs = {"browser.startup.homepage": "http://planet.mozilla.org/"}
        json = '{"browser.startup.homepage": "http://planet.mozilla.org/"}'

        # just repr it...could use the json module but we don't need it here
        with mozfile.NamedTemporaryFile(suffix='.json') as f:
            f.write(json)
            f.flush()

            commandline = ["--preferences", f.name]
            self.compare_generated(_prefs, commandline)

    def test_prefs_write(self):
        """test that the Preferences.write() method correctly serializes preferences"""

        _prefs = {'browser.startup.homepage': "http://planet.mozilla.org",
                  'zoom.minPercent': 30,
                  'zoom.maxPercent': 300}

        # make a Preferences manager with the testing preferences
        preferences = Preferences(_prefs)

        # write them to a temporary location
        path = None
        read_prefs = None
        try:
            with mozfile.NamedTemporaryFile(suffix='.js', delete=False) as f:
                path = f.name
                preferences.write(f, _prefs)

            # read them back and ensure we get what we put in
            read_prefs = dict(Preferences.read_prefs(path))

        finally:
            # cleanup
            if path and os.path.exists(path):
                os.remove(path)

        self.assertEqual(read_prefs, _prefs)

    def test_read_prefs_with_comments(self):
        """test reading preferences from a prefs.js file that contains comments"""

        path = os.path.join(here, 'files', 'prefs_with_comments.js')
        self.assertEqual(dict(Preferences.read_prefs(path)), self._prefs_with_comments)

    def test_read_prefs_with_interpolation(self):
        """test reading preferences from a prefs.js file whose values
        require interpolation"""

        expected_prefs = {
            "browser.foo": "http://server-name",
            "zoom.minPercent": 30,
            "webgl.verbose": "false",
            "browser.bar": "somethingxyz"
        }
        values = {
            "server": "server-name",
            "abc": "something"
        }
        path = os.path.join(here, 'files', 'prefs_with_interpolation.js')
        read_prefs = Preferences.read_prefs(path, interpolation=values)
        self.assertEqual(dict(read_prefs), expected_prefs)

    def test_read_prefs_ttw(self):
        """test reading preferences through the web via mozhttpd"""

        # create a MozHttpd instance
        docroot = os.path.join(here, 'files')
        host = '127.0.0.1'
        port = 8888
        httpd = mozhttpd.MozHttpd(host=host, port=port, docroot=docroot)

        # create a preferences instance
        prefs = Preferences()

        try:
            # start server
            httpd.start(block=False)

            # read preferences through the web
            read = prefs.read_prefs('http://%s:%d/prefs_with_comments.js' % (host, port))
            self.assertEqual(dict(read), self._prefs_with_comments)
        finally:
            httpd.stop()


if __name__ == '__main__':
    mozunit.main()
