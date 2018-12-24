from django.apps import AppConfig


class QuizConfig(AppConfig):
    name = 'quiz'


QuizAnsJSONFormats = [
    {
        "properties": {
            "questionType": "number",
            "correct": {
                "type": "number"
            },
            "tries": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
        },
        "type": "object",
        "required": [ "questionType", "correct" ]
    },
    {
        "properties": {
            "questionType": {
                "anyOf": ["boolean", "trilean"]
            }
        },
        "type": "object",
        "required": [ "questionType" ]
    },
    {
        "properties": {
            "questionType": "multipleChoice",
            "choices": {
                "type": "object",
                "minProperties": 2,
                "maxProperties": 8,
                "properties": {
                    "propertyNames": {
                        "type": "string",
                        "contentMediaType": "text/plain"
                    }
                }
            },
        },
        "type": "object",
        "required": [ "questionType", "choices" ]
    }
]
