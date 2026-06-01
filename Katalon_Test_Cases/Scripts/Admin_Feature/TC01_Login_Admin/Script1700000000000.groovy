import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

/**
 * TEST CASE: Login sebagai Admin
 * Step:
 * 1. Buka Browser
 * 2. Masukkan URL aplikasi ke halaman Login
 * 3. Isi Username dan Password
 * 4. Klik tombol Login
 * 5. Tunggu dan Verifikasi masuk ke Dashboard
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

// Step 1: Navigasi ke URL Login
WebUI.navigateToUrl('http://localhost:5173/login')
WebUI.delay(1)

// Step 2: Input Kredensial
WebUI.setText(findTestObject('Object Repository/Login/Input_Username'), 'admin')
WebUI.setText(findTestObject('Object Repository/Login/Input_Password'), 'admin123')

// Step 3: Klik Login
WebUI.click(findTestObject('Object Repository/Login/Btn_Login'))

// Step 4: Verifikasi Login Sukses (misal muncul element ticker atau text Admin)
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Text_AdminPanel'), 5)
