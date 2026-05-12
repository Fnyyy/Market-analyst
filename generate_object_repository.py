import os
import uuid

base_dir = r"d:\market\Katalon_Test_Cases\Object Repository"

objects = {
    "Login/Input_Username": "//input[@id='login-username']",
    "Login/Input_Password": "//input[@id='login-password']",
    "Login/Btn_Login": "//button[@id='login-submit']",
    "Admin/Text_AdminPanel": "//*[contains(@class, 'admin-brand-name') and contains(text(), 'Sisvest')]",
    "Admin/Text_UserManagement": "//h1[contains(text(), 'User Management')]",
    "Admin/Input_SearchUser": "//input[@placeholder='Search users...']",
    "Admin/Table/Text_UserName_Budi": "//div[@class='admin-user-name' and contains(text(), 'budi')]",
    "Admin/Table/Btn_ToggleUserStatus": "//tr[descendant::div[@class='admin-user-name' and contains(text(), 'budi')]]//button[contains(@class, 'admin-action-btn') and (contains(text(), 'Deactivate') or contains(text(), 'Activate'))]",
    "Admin/Toast_Success": "//div[contains(@class, 'admin-toast') and contains(@class, 'admin-toast--success')]",
    "Admin/Table/Btn_ResetPassword": "//tr[descendant::div[@class='admin-user-name' and contains(text(), 'budi')]]//button[contains(@class, 'admin-action-btn') and contains(text(), 'Reset PW')]",
    "Admin/Modal/Text_ResetPasswordTitle": "//h3[contains(text(), 'Reset Password')]",
    "Admin/Modal/Input_NewPassword": "//input[@placeholder='Min 6 characters']",
    "Admin/Modal/Input_ConfirmPassword": "//input[@placeholder='Repeat password']",
    "Admin/Modal/Btn_SubmitReset": "//button[@type='submit' and contains(., 'Reset')]",
    "Admin/Nav_TabResearch": "//button[contains(@class, 'admin-nav-item') and contains(., 'Research Management')]",
    "Admin/Text_ResearchManagement": "//h1[contains(text(), 'Research Management')]",
    "Admin/Btn_NewReport": "//button[contains(@class, 'admin-btn') and contains(., 'New Report')]",
    "Admin/Modal_Research/Input_Ticker": "//input[@name='ticker']",
    "Admin/Modal_Research/Input_AnalystName": "//input[@name='analystName']",
    "Admin/Modal_Research/Input_Title": "//input[@name='title']",
    "Admin/Modal_Research/Input_CurrentPrice": "//input[@name='currentPrice']",
    "Admin/Modal_Research/Input_TargetPrice": "//input[@name='targetPrice']",
    "Admin/Modal_Research/Select_Rating": "//select[@name='rating']",
    "Admin/Modal_Research/Select_RiskLevel": "//select[@name='riskLevel']",
    "Admin/Modal_Research/Input_Tags": "//input[@name='tags']",
    "Admin/Modal_Research/Textarea_Body": "//textarea[@name='body']",
    "Admin/Modal_Research/Btn_SaveReport": "//button[@type='submit' and contains(., 'Save Report')]",
    "Admin/Table/Btn_EditReport_Row1": "(//button[contains(@class, 'admin-action-btn') and contains(., 'Edit')])[1]",
    "Research/Text_ResearchReportsHeader": "//h1[contains(text(), 'Research Reports')]",
    "Research/Card_Title_BBCA": "//h3",
    "Research/Link_ReadResearch_BBCA": "(//a[contains(@class, 'read-more')])[1]",
    "Research_Detail/Text_ExecutiveOverview": "//h2[contains(text(), 'Executive Overview')]"
}

for path, xpath in objects.items():
    full_path = os.path.join(base_dir, path.replace("/", "\\") + ".rs")
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<WebElementEntity>
   <description></description>
   <name>{os.path.basename(path)}</name>
   <tag></tag>
   <elementGuidId>{uuid.uuid4()}</elementGuidId>
   <selectorCollection>
      <entry>
         <key>XPATH</key>
         <value>{xpath}</value>
      </entry>
   </selectorCollection>
   <selectorMethod>XPATH</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
</WebElementEntity>
"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(xml_content)

print("Object Repository generated successfully!")
