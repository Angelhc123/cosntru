#!/usr/bin/env python3
"""
Script para probar las credenciales de DialogFlow localmente
Ayuda a diagnosticar problemas antes de deployar a Railway
"""

import os
import json
from google.oauth2 import service_account
from google.cloud import dialogflow

def test_credentials():
    """Probar las credenciales de DialogFlow"""
    
    print("🔧 Testing DialogFlow credentials...")
    
    # Ruta al archivo de credenciales
    credentials_file = "/home/desci/Documentos/todo/upt-chat-fhps-32542378a9cb.json"
    
    if not os.path.exists(credentials_file):
        print(f"❌ Credentials file not found: {credentials_file}")
        return False
        
    print(f"📁 Using credentials: {credentials_file}")
    
    try:
        # Probar cargar las credenciales
        credentials = service_account.Credentials.from_service_account_file(
            credentials_file,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        print("✅ Credentials loaded successfully")
        print(f"📧 Service account email: {credentials.service_account_email}")
        
        # Probar crear el cliente de DialogFlow
        session_client = dialogflow.SessionsClient(credentials=credentials)
        print("✅ DialogFlow client created successfully")
        
        # Probar una detección de intent simple
        project_id = "upt-chat-fhps"
        session_id = "test-session-123"
        language_code = "es"
        
        session_path = f"projects/{project_id}/agent/sessions/{session_id}"
        
        text_input = dialogflow.TextInput(
            text="hola",
            language_code=language_code
        )
        
        query_input = dialogflow.QueryInput(text=text_input)
        
        print("🔄 Testing intent detection...")
        response = session_client.detect_intent(
            request={
                "session": session_path,
                "query_input": query_input
            }
        )
        
        print("✅ DialogFlow request successful!")
        print(f"📋 Intent detected: {response.query_result.intent.display_name}")
        print(f"📋 Confidence: {response.query_result.intent_detection_confidence:.3f}")
        print(f"📋 Response text: {response.query_result.fulfillment_text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"❌ Exception type: {type(e).__name__}")
        import traceback
        print(f"❌ Full traceback:")
        traceback.print_exc()
        return False

def test_env_vars_method():
    """Probar el método de variables de entorno"""
    
    print("\n" + "="*50)
    print("🔧 Testing environment variables method...")
    
    # Simular variables de entorno
    os.environ['GOOGLE_PROJECT_ID'] = 'upt-chat-fhps'
    os.environ['GOOGLE_CLIENT_EMAIL'] = 'dialogflow-client@upt-chat-fhps.iam.gserviceaccount.com'
    os.environ['GOOGLE_PRIVATE_KEY_ID'] = '32542378a9cbc046369388e165632d4f611c4c08'
    os.environ['GOOGLE_CLIENT_ID'] = '106936197559669141182'
    
    # Cargar la private key del archivo original
    with open("/home/desci/Documentos/todo/upt-chat-fhps-32542378a9cb.json", 'r') as f:
        original_data = json.load(f)
        private_key = original_data['private_key']
    
    os.environ['GOOGLE_PRIVATE_KEY'] = private_key
    
    # Crear credenciales dinámicamente
    credentials_data = {
        "type": "service_account",
        "project_id": os.environ['GOOGLE_PROJECT_ID'],
        "private_key_id": os.environ['GOOGLE_PRIVATE_KEY_ID'],
        "private_key": os.environ['GOOGLE_PRIVATE_KEY'],
        "client_email": os.environ['GOOGLE_CLIENT_EMAIL'],
        "client_id": os.environ['GOOGLE_CLIENT_ID'],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ['GOOGLE_CLIENT_EMAIL'].replace('@', '%40')}",
        "universe_domain": "googleapis.com"
    }
    
    # Escribir archivo temporal
    temp_file = "/tmp/test-credentials.json"
    with open(temp_file, 'w') as f:
        json.dump(credentials_data, f, indent=2)
    
    print(f"📁 Created temporary credentials: {temp_file}")
    print(f"📏 File size: {os.path.getsize(temp_file)} bytes")
    
    # Probar con el archivo temporal
    try:
        credentials = service_account.Credentials.from_service_account_file(
            temp_file,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        print("✅ Environment variables method works!")
        
        # Limpiar
        os.remove(temp_file)
        return True
        
    except Exception as e:
        print(f"❌ Environment variables method failed: {str(e)}")
        
        # Mostrar el contenido del archivo para debug
        print("\n📋 Generated credentials content:")
        with open(temp_file, 'r') as f:
            content = f.read()
            print(content[:500] + "..." if len(content) > 500 else content)
        
        # Limpiar
        os.remove(temp_file)
        return False

if __name__ == "__main__":
    print("🧪 DialogFlow Credentials Test")
    print("=" * 50)
    
    # Método 1: Archivo directo
    success1 = test_credentials()
    
    # Método 2: Variables de entorno
    success2 = test_env_vars_method()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS:")
    print(f"Direct file method: {'✅ SUCCESS' if success1 else '❌ FAILED'}")
    print(f"Environment vars method: {'✅ SUCCESS' if success2 else '❌ FAILED'}")
    
    if success1 and success2:
        print("🎉 All tests passed! DialogFlow should work on Railway.")
    else:
        print("⚠️ Some tests failed. Check the errors above.")