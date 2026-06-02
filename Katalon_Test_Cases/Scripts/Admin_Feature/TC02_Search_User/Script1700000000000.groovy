import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import groovy.json.JsonOutput
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase

/**
 * TEST CASE: Search User di Halaman Admin
 * Step:
 * 1. Buat user baru 'budi' via API jika belum ada
 * 2. Buka Halaman Admin (Pastikan sudah login)
 * 3. Ketikkan nama user 'budi' di kolom Search
 * 4. Verifikasi user yang dicari muncul di tabel
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

// Step 2: Buka Admin Panel & Login jika belum
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

WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Text_UserManagement'), 5)

// Step 3: Input search
WebUI.setText(findTestObject('Object Repository/Admin/Input_SearchUser'), 'budi')
WebUI.delay(2) // Tunggu filter react selesai

// Step 4: Verifikasi hasil search di tabel
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Table/Text_UserName_Budi'), 5)
