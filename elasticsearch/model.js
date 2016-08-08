module.exports.userSettings = {
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        },
        "my_english": {
          "type":      "english",
          "stopwords": "_english_"
        }
      }
    }
  },
  'mappings': {
    'user': {
      'properties': {
        'username': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "profile_picture": {
          "type": "string",
          "index": "not_analyzed"
        },
        "description": {
          "type": "string",
          "search_analyzer": "my_english"
        },
        "past_work": {
          "type": "string",
          "index": "not_analyzed"
        },
        "date_of_birth": {
          "type": "date"
        },
        "nationality": {
          "type": "string"
        },
        "religion": {
          "type": "string"
        },
        "funding_needed": {
          "type": "integer"
        },
        "organisation_or_user": {
          "type": "boolean"
        },
        "suggest": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": false
        }
      }
    }
  }
};

module.exports.fundSettings = {
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        },
        "my_english": {
          "type":      "english",
          "stopwords": "_english_"
        }
      }
    }
  },
  'mappings': {
    'autocomplete_countries': {
      'properties': {
        'country': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "suggest_countries": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": true
        }
      }
    },
    'autocomplete_degrees': {
      'properties': {
        'degree': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "suggest_degrees": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": true
        }
      }
    },
    'autocomplete_universities': {
      'properties': {
        'university': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "suggest_universities": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": true
        }
      }
    },
    'autocomplete_religions': {
      'properties': {
        'degree': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "suggest_religions": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": true
        }
      }
    },
    'autocomplete_subjects': {
      'properties': {
        'subject': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete", "search_analyzer": "my_english" }
          }
        },
        "suggest_subjects": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": true
        }
      }
    },
    'fund': {
      'properties': {
        "application_decision_date": {
          "type": "date"
        },
        "application_documents": {
          "type": "string"
        },
        "application_open_date": {
          "type": "date"
        },
        'title': {
          'type': 'string',
          'fields': {
            "autocomplete": { "type": "string", "index_analyzer": "autocomplete" }
          }
        },
        "tags": {
          "type": "string",
          "index_name": "tag"
        },
        "duration_of_scholarship": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "maximum_amount": {
          "type": "long"
        },
        "minimum_amount": {
          "type": "long"
        },
        "maximum_age": {
          "type": "integer"
        },
        "minimum_age": {
          "type": "integer"
        },
        "number_of_places": {
          "type": "integer"
        },
        "interview_date": {
          "type": "date"
        },
        "invite_only": {
          "type": "boolean"
        },
        "link": {
          "type": "string"
        },
        "religion": {
          "type": "string"
        },
        "gender": {
          "type": "string"
        },
        "financial_situation": {
          "type": "string"
        },
        "merit_or_finance": {
          "type": "string"
        },
        "country_of_residence": {
          "type": "string"
        },
        "target_country": {
          "type": "string"
        },
        "required_grade": {
          "type": "string"
        },
        "specific_location": {
          "type": "string"
        },
        "subject": {
          "type": "string"
        },
        "target_degree": {
          "type": "string"
        },
        "target_university": {
          "type": "string"
        },
        "required_degree": {
          "type": "string"
        },
        "required_university": {
          "type": "string"
        },
        "description": {
          "type": "string",
          "index": "not_analyzed"
        },
        "suggest_funds": {
          "type": "completion",
          "index_analyzer": "simple",
          "search_analyzer": "simple",
          "payloads": false
        },
        "deadline": {
          "type": "date"
        },
        "organisation_id" : {
          "type": "integer"
        }
      }
    }
  }
};
