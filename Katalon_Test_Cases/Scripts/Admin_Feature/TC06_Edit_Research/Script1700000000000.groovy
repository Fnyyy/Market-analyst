import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase

/**
 * TEST CASE: Edit Research Report (Admin)
 * Step:
 * 1. Buka Halaman Admin -> Tab Research
 * 2. Klik tombol Edit pada salah satu Laporan
 * 3. Ubah Target Price
 * 4. Klik "Save Report"
 * 5. Verifikasi laporan berhasil diperbarui
 */

import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.model.FailureHandling as FailureHandling

// Step 1: Navigasi & Login jika belum
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

WebUI.click(findTestObject('Object Repository/Admin/Nav_TabResearch'))

// Step 2: Buka modal Edit di baris tabel pertama
WebUI.click(findTestObject('Object Repository/Admin/Table/Btn_EditReport_Row1'))

// Step 3: Ubah Target Harga
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_TargetPrice'), '10500')

// Step 4: Simpan
WebUI.click(findTestObject('Object Repository/Admin/Modal_Research/Btn_SaveReport'))

// Step 5: Verifikasi
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Toast_Success'), 5)
WebUI.delay(2)
