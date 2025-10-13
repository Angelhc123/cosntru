#!/usr/bin/env python3
"""
Script de prueba rápida para RF004 - Validación por Correo Personal
Verifica que los componentes principales funcionen correctamente
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from application.detectors.sensitive_query_detector import SensitiveQueryDetector
import re


def test_sensitive_detector():
    """Prueba el detector de consultas sensibles"""
    print("=" * 60)
    print("🧪 PRUEBA 1: Detector de Consultas Sensibles")
    print("=" * 60)
    
    detector = SensitiveQueryDetector()
    
    test_cases = [
        ("olvidé mi contraseña", True, "password"),
        ("recuperar contraseña", True, "password"),
        ("quiero ver mis notas", True, "grades"),
        ("consultar mis pagos", True, "payments"),
        ("mi horario de clases", True, "academic"),
        ("estado de mi trámite", True, "procedures"),
        ("hola cómo estás", False, None),
        ("cuándo son las inscripciones", False, None),
    ]
    
    passed = 0
    failed = 0
    
    for message, expected_sensitive, expected_category in test_cases:
        is_sensitive = detector.is_sensitive_query(message)
        category = detector.get_sensitive_category(message)
        
        if is_sensitive == expected_sensitive and category == expected_category:
            print(f"✅ '{message}' -> Sensible: {is_sensitive}, Categoría: {category}")
            passed += 1
        else:
            print(f"❌ '{message}' -> Esperado: {expected_sensitive}/{expected_category}, Obtenido: {is_sensitive}/{category}")
            failed += 1
    
    print(f"\n📊 Resultado: {passed} pasadas, {failed} fallidas")
    return failed == 0


def test_email_validation():
    """Prueba la validación de formato de email"""
    print("\n" + "=" * 60)
    print("🧪 PRUEBA 2: Validación de Formato de Email")
    print("=" * 60)
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    test_cases = [
        ("usuario@upt.edu.pe", True),
        ("alumno123@gmail.com", True),
        ("nombre.apellido@hotmail.com", True),
        ("invalido@", False),
        ("@dominio.com", False),
        ("sindominio", False),
        ("espacios @email.com", False),
    ]
    
    passed = 0
    failed = 0
    
    for email, expected_valid in test_cases:
        is_valid = bool(re.match(email_pattern, email))
        
        if is_valid == expected_valid:
            print(f"✅ '{email}' -> {is_valid}")
            passed += 1
        else:
            print(f"❌ '{email}' -> Esperado: {expected_valid}, Obtenido: {is_valid}")
            failed += 1
    
    print(f"\n📊 Resultado: {passed} pasadas, {failed} fallidas")
    return failed == 0


def test_validation_prompts():
    """Prueba los mensajes de validación por categoría"""
    print("\n" + "=" * 60)
    print("🧪 PRUEBA 3: Mensajes de Validación")
    print("=" * 60)
    
    detector = SensitiveQueryDetector()
    
    categories = ["password", "grades", "academic", "payments", "procedures"]
    
    for category in categories:
        prompt = detector.get_validation_prompt(category)
        print(f"\n📋 Categoría: {category}")
        print(f"   Mensaje: {prompt[:100]}...")
        
        # Verificar que el mensaje contenga palabras clave
        assert "correo" in prompt.lower() or "email" in prompt.lower()
        assert "validar" in prompt.lower() or "identidad" in prompt.lower()
        print("   ✅ Mensaje válido")
    
    return True


def main():
    """Ejecuta todas las pruebas"""
    print("\n" + "🚀" * 30)
    print("SUITE DE PRUEBAS RF004 - VALIDACIÓN POR CORREO PERSONAL")
    print("🚀" * 30 + "\n")
    
    results = []
    
    # Prueba 1
    results.append(("Detector de Consultas Sensibles", test_sensitive_detector()))
    
    # Prueba 2
    results.append(("Validación de Email", test_email_validation()))
    
    # Prueba 3
    results.append(("Mensajes de Validación", test_validation_prompts()))
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 RESUMEN FINAL")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASÓ" if passed else "❌ FALLÓ"
        print(f"{status} - {test_name}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("=" * 60)
        return 0
    else:
        print("⚠️  ALGUNAS PRUEBAS FALLARON")
        print("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
