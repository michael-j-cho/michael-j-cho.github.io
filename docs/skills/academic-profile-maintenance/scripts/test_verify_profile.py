import copy
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch
from verify_profile import bib_inventory, pdf_pages, validate_data


class AuditTests(unittest.TestCase):
    def setUp(self):
        self.pubs = [{'title': 'Test Paper', 'venue': 'Journal', 'highlight': 'Journal 2026', 'type': 'journal', 'year': 2026, 'authors': ['Michael Cho'], 'links': [{'text': 'Paper', 'url': 'https://doi.org/10.1234/test'}]}]
        self.news = [{'date': '2026.10', 'title': 'Test', 'description': 'Test description'}]

    def test_valid_data(self):
        validate_data(self.pubs, self.news)

    def test_duplicate_title(self):
        with self.assertRaises(ValueError):
            validate_data(self.pubs * 2, self.news)

    def test_duplicate_identifier(self):
        extra = copy.deepcopy(self.pubs[0])
        extra['title'] = 'Different Title'
        with self.assertRaises(ValueError):
            validate_data(self.pubs + [extra], self.news)

    def test_news_invalid_month(self):
        self.news[0]['date'] = '2026.13'
        with self.assertRaises(ValueError):
            validate_data(self.pubs, self.news)

    def test_news_order(self):
        with self.assertRaises(ValueError):
            validate_data(self.pubs, [{'date': '2025.01', 'title': 'Old', 'description': 'Old'}] + self.news)

    def test_bib_inventory(self):
        self.assertEqual(bib_inventory('@article{test,\n doi = {10.1234/TEST}\n}'), ({'test'}, {'10.1234/test'}))

    def test_bib_duplicate_key(self):
        with self.assertRaises(ValueError):
            bib_inventory('@article{test,\n}\n@article{test,\n}')

    def test_bib_duplicate_doi(self):
        with self.assertRaises(ValueError):
            bib_inventory('doi = {10.1234/a}\ndoi = {10.1234/A}')

    @patch('verify_profile.subprocess.run')
    def test_pdf_pages(self, run):
        run.return_value = subprocess.CompletedProcess([], 0, stdout=b'Pages: 2\n')
        self.assertEqual(pdf_pages(b'%PDF-1.7'), 2)

    def test_reject_html_pdf(self):
        with self.assertRaises(ValueError):
            pdf_pages(b'<html>Not found</html>')


if __name__ == '__main__':
    unittest.main()
