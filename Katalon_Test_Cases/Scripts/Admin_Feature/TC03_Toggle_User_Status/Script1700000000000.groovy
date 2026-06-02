import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import groovy.json.JsonOutput

/**
 * TEST CASE: Mengaktifkan / Menonaktifkan User (Toggle Status)
 * Step:
 * 1. Buat user baru 'budi' via API jika belum ada
 * 2. Buka Halaman Admin Panel (Login jika belum)
 * 3. Klik tombol toggle milik 'budi' (Activate/Deactivate)
 * 4. Verifikasi munculnya toast notifikasi sukses
 */

// Step 1: Daftarkan user 'budi' via API (abaikan jika sudah terdaftar)
try {
    URL url = new URL("http://localhost:8000/api/auth/register")
    HttpURLConnection conn = (HttpURLConnection) url.openConnection()
    conn.setRequestMethod("POST")
    conn.setRequestProperty("Content-Type", "application/json")
    conn.setDoOutput(true)
    
    Map payload = [
        username: "budi",
        password: "budi123Password",
        email: "budi@example.com",
        full_name: "Budi Santoso",
        security_question: "What city were you born in?",
        security_answer: "jakarta"
    ]
    
    OutputStream os = conn.getOutputStream()
    os.write(JsonOutput.toJson(payload).getBytes("UTF-8"))
    os.close()
    
    int responseCode = conn.getResponseCode()
    println("Register 'budi' status code: " + responseCode)
} catch (Exception e) {
    println("Register 'budi' failed/already exists: " + e.getMessage())
}

// Step 2: Navigasi & Login jika belum
boolean isBrowserOpen = true
try {
    DriverFactory.getWebDriver()
} catch (Exception e) {
    isBrowserOpen = false
}

if (!isBrowserOpen) {
    WebUI.callTestCase(findTestCase('Admin_Feature/TC01_Login_Admin'), [:], FailureHandling.STOP_ON_FAILURE)
} else {
    WebUI.navigateToUrl('http://localhost:5173/admin')
}

// Step 3: Temukan tombol toggle di baris user 'budi' dan klik
WebUI.click(findTestObject('Object Repository/Admin/Table/Btn_ToggleUserStatus'))

// Step 4: Verifikasi pesan sukses muncul di kanan bawah (Toast)
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Toast_Success'), 5)
WebUI.delay(2)
