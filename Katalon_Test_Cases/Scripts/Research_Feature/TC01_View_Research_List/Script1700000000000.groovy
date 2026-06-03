import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

/**
 * TEST CASE: Melihat Daftar Research (Publik)
 * Step:
 * 1. Buka Browser (Bisa tanpa login)
 * 2. Navigasi ke URL '/research'
 * 3. Verifikasi halaman memuat daftar laporan (Grid)
 * 4. Verifikasi Laporan spesifik (misal dari hasil tambah di Admin) muncul di list
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

// Step 1 & 2: Akses Halaman Research
WebUI.navigateToUrl('http://localhost:5173/research')

// Step 3: Verifikasi halaman terbuka dengan tulisan Research Reports
WebUI.verifyElementPresent(findTestObject('Object Repository/Research/Text_ResearchReportsHeader'), 5)

// Step 4: Verifikasi adanya Card laporan di dalam Grid
WebUI.verifyElementPresent(findTestObject('Object Repository/Research/Card_Title_BBCA'), 5)
