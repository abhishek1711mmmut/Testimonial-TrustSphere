import unittest
from unittest.mock import patch
from flask import Flask
from routes.embed_routes import bp


class ScrollingWallTests(unittest.TestCase):
    def setUp(self):
        app = Flask(__name__)
        app.register_blueprint(bp)
        self.client = app.test_client()
        self.card = dict(id=1, reviewer_name='<b>Customer</b>', reviewer_image=None,
                         rating=5, review='Useful feedback', video=None,
                         attached_images=[], created_at='')
        self.fetch = patch('services.embed_services._fetch_space_and_testimonials',
                           return_value=({'spaceName': 'Sample', 'companyLogo': None}, [self.card]))
        self.fetch.start()
        self.addCleanup(self.fetch.stop)

    def test_scrolling_options_and_escaped_content(self):
        response = self.client.get('/embed/1?layout=scrolling&animation=off&speed=normal')
        html = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        for value in ['data-animation="off"', 'data-speed="normal"', 'scrolling-wall.js',
                      'id="ts-wall"', '&lt;b&gt;Customer&lt;/b&gt;']:
            self.assertIn(value, html)

    def test_defaults_and_existing_layouts(self):
        html = self.client.get('/embed/1?layout=scrolling&speed=bad').get_data(as_text=True)
        self.assertIn('data-speed="slow"', html)
        for url in ['/embed/1?layout=grid', '/embed/1?layout=carousel', '/embed/1/testimonial/1']:
            html = self.client.get(url).get_data(as_text=True)
            self.assertNotIn('src="/static/js/scrolling-wall.js"', html)
