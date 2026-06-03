import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase

/**
 * TEST CASE: Buat Research Laporan Baru (Admin)
 * Step:
 * 1. Buka Halaman Admin Panel
 * 2. Klik tab "Research Management"
 * 3. Klik tombol "New Report"
 * 4. Isi seluruh form pada Modal (Ticker, Analyst, Title, Harga, Rating, Summary)
 * 5. Klik "Save Report"
 * 6. Verifikasi laporan berhasil ditambahkan
 */

import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.model.FailureHandling as FailureHandling

// Step 1 & 2: Navigasi dan Pindah Tab & Login jika belum
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
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Text_ResearchManagement'), 5)

// Step 3: Klik New Report
WebUI.click(findTestObject('Object Repository/Admin/Btn_NewReport'))

// Step 4: Isi Form Modal
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_Ticker'), 'BBCA.JK')
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_AnalystName'), 'Budi Santoso')
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_Title'), 'Laporan Q3 Bank Central Asia')
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_CurrentPrice'), '8500')
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_TargetPrice'), '10000')

WebUI.selectOptionByValue(findTestObject('Object Repository/Admin/Modal_Research/Select_Rating'), 'BUY', false)
WebUI.selectOptionByValue(findTestObject('Object Repository/Admin/Modal_Research/Select_RiskLevel'), 'Low', false)

WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Input_Tags'), 'Banking, Bluechip')
WebUI.setText(findTestObject('Object Repository/Admin/Modal_Research/Textarea_Body'), 'Laporan ini menunjukkan performa solid BBCA di kuartal ketiga.')

// Step 5: Save
WebUI.click(findTestObject('Object Repository/Admin/Modal_Research/Btn_SaveReport'))

// Step 6: Verifikasi
WebUI.verifyElementPresent(findTestObject('Object Repository/Admin/Toast_Success'), 5)
WebUI.delay(2)
