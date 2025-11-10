#!/usr/bin/env python3
"""
Script para probar DialogFlow directamente y ver qué está respondiendo
"""
import os
import json
from google.cloud import dialogflow_v2 as dialogflow

# Configurar credenciales desde variables de entorno
credentials_dict = {
    "type": "service_account",
    "project_id": os.environ.get("GOOGLE_PROJECT_ID"),
    "private_key_id": os.environ.get("GOOGLE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("GOOGLE_PRIVATE_KEY", "").replace("\\n", "\n"),
    "client_email": os.environ.get("GOOGLE_CLIENT_EMAIL"),
    "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ.get('GOOGLE_CLIENT_EMAIL')}"
}

# Guardar credenciales temporalmente
with open("/tmp/dialogflow_test_creds.json", "w") as f:
    json.dump(credentials_dict, f)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/dialogflow_test_creds.json"

# Configuración
PROJECT_ID = os.environ.get("GOOGLE_PROJECT_ID", "upt-chat-fhps")
SESSION_ID = "test-direct-session"
LANGUAGE_CODE = "es"

def detect_intent(text):
    """Envía un mensaje a DialogFlow y muestra la respuesta completa"""
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(PROJECT_ID, SESSION_ID)
    
    print(f"\n{'='*60}")
    print(f"📤 Enviando mensaje a DialogFlow: '{text}'")
    print(f"{'='*60}\n")
    
    text_input = dialogflow.TextInput(text=text, language_code=LANGUAGE_CODE)
    query_input = dialogflow.QueryInput(text=text_input)
    
    response = session_client.detect_intent(
        request={"session": session, "query_input": query_input}
    )
    
    query_result = response.query_result
    
    print(f"📥 RESPUESTA DE DIALOGFLOW:")
    print(f"├─ Intent detectado: {query_result.intent.display_name}")
    print(f"├─ Confianza: {query_result.intent_detection_confidence:.4f}")
    print(f"├─ Fulfillment Text: {query_result.fulfillment_text}")
    print(f"├─ Query Text: {query_result.query_text}")
    print(f"├─ Language: {query_result.language_code}")
    
    if query_result.webhook_status:
        print(f"├─ Webhook Status: {query_result.webhook_status}")
    
    if query_result.parameters:
        print(f"└─ Parámetros: {dict(query_result.parameters)}")
    
    print(f"\n{'='*60}\n")
    
    return query_result

if __name__ == "__main__":
    # Probar varios mensajes
    test_messages = [
        "hola",
        "buenos días",
        "olvidé mi contraseña",
        "ayuda con problemas técnicos"
    ]
    
    print(f"🤖 PRUEBA DIRECTA DE DIALOGFLOW")
    print(f"Project: {PROJECT_ID}")
    print(f"Session: {SESSION_ID}")
    
    for msg in test_messages:
        try:
            detect_intent(msg)
        except Exception as e:
            print(f"❌ Error con mensaje '{msg}': {e}\n")
    
    # Limpiar archivo temporal
    os.remove("/tmp/dialogflow_test_creds.json")
    print("✅ Prueba completada")
