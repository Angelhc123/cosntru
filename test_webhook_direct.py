#!/usr/bin/env python3
"""
Test directo del webhook para verificar que está respondiendo correctamente
"""
import requests
import json

# URL del webhook en Railway
WEBHOOK_URL = "https://nlp-service-production-3f94.up.railway.app/webhook"

# Simular el body que envía Dialogflow para el intent "Saludos"
dialogflow_body = {
    "responseId": "test-response-id",
    "queryResult": {
        "queryText": "hola",
        "parameters": {},
        "allRequiredParamsPresent": True,
        "fulfillmentText": "Respuesta por defecto",
        "fulfillmentMessages": [],
        "outputContexts": [],
        "intent": {
            "name": "projects/upt-chat-fhps/agent/intents/saludos-intent-id",
            "displayName": "Saludos"
        },
        "intentDetectionConfidence": 1.0,
        "languageCode": "es"
    },
    "session": "projects/upt-chat-fhps/agent/sessions/test-session-123"
}

print("🔍 PROBANDO WEBHOOK DIRECTAMENTE")
print(f"URL: {WEBHOOK_URL}")
print(f"Body: {json.dumps(dialogflow_body, indent=2)}")
print("\n" + "="*60)

try:
    response = requests.post(
        WEBHOOK_URL, 
        json=dialogflow_body,
        headers={
            "Content-Type": "application/json"
        },
        timeout=10
    )
    
    print(f"✅ Status Code: {response.status_code}")
    print(f"✅ Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Respuesta JSON:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        if "fulfillmentText" in result:
            print(f"\n🎯 FULFILLMENT TEXT:")
            print(f'"{result["fulfillmentText"]}"')
        else:
            print("❌ No hay fulfillmentText en la respuesta")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"❌ Respuesta: {response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"❌ Error de conexión: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
print("🏁 Prueba completada")