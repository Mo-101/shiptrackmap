import connexion
import six

from swagger_server.models.analyze_body import AnalyzeBody  # noqa: E501
from swagger_server.models.inline_response200 import InlineResponse200  # noqa: E501
from swagger_server.models.inline_response2001 import InlineResponse2001  # noqa: E501
from swagger_server.models.inline_response2002 import InlineResponse2002  # noqa: E501
from swagger_server import util


def analyze_post(body):  # noqa: E501
    """Run shipment analysis with AHP-TOPSIS engine

     # noqa: E501

    :param body: 
    :type body: dict | bytes

    :rtype: InlineResponse200
    """
    if connexion.request.is_json:
        body = AnalyzeBody.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def memory_request_reference_get(request_reference):  # noqa: E501
    """Get memory recall for a decision

     # noqa: E501

    :param request_reference: 
    :type request_reference: str

    :rtype: InlineResponse2002
    """
    return 'do some magic!'


def rules_ref_get(ref):  # noqa: E501
    """Get rule invocations for a decision reference

     # noqa: E501

    :param ref: 
    :type ref: str

    :rtype: List[InlineResponse2001]
    """
    return 'do some magic!'
