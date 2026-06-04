import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

/**
 * TEST CASE: Membaca Detail Research Report (Publik)
 * Step:
 * 1. Buka URL Halaman Research ('/research')
 * 2. Klik link "Read Research ->" pada salah satu Card
 * 3. Verifikasi halaman berpindah ke detail research
 * 4. Pastikan teks "Executive Overview" atau judul ticker ada
 */

import com.kms.katalon.core.webui.driver.DriverFactory

// Step 1: Buka Browser & Navigasi jika belum
boolean isBrowserOpen = true
try {
    DriverFactory.getWebDriver()
} catch (Exception e) {
    isBrowserOpen = false
}

if (!isBrowserOpen) {
    WebUI.openBrowser('')
    WebUI.maximizeWindow()
}

WebUI.navigateToUrl('http://localhost:5173/research')

// Step 2: Tunggu dan klik link Read Research di laporan
WebUI.waitForElementPresent(findTestObject('Object Repository/Research/Link_ReadResearch_BBCA'), 5)
WebUI.click(findTestObject('Object Repository/Research/Link_ReadResearch_BBCA'))

// Step 3 & 4: Verifikasi halaman detail
WebUI.verifyElementPresent(findTestObject('Object Repository/Research_Detail/Text_ExecutiveOverview'), 5)

WebUI.closeBrowser()
