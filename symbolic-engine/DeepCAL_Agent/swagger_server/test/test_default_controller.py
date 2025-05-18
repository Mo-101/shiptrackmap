# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.analyze_body import AnalyzeBody  # noqa: E501
from swagger_server.models.inline_response200 import InlineResponse200  # noqa: E501
from swagger_server.models.inline_response2001 import InlineResponse2001  # noqa: E501
from swagger_server.models.inline_response2002 import InlineResponse2002  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_analyze_post(self):
        """Test case for analyze_post

        Run shipment analysis with AHP-TOPSIS engine
        """
        body = AnalyzeBody()
        response = self.client.open(
            '/analyze',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_memory_request_reference_get(self):
        """Test case for memory_request_reference_get

        Get memory recall for a decision
        """
        response = self.client.open(
            '/memory/{request_reference}'.format(request_reference='request_reference_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_rules_ref_get(self):
        """Test case for rules_ref_get

        Get rule invocations for a decision reference
        """
        response = self.client.open(
            '/rules/{ref}'.format(ref='ref_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
