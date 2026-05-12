import os
import uuid
import glob
import shutil

project_dir = r"d:\market\Katalon_Test_Cases"
if not os.path.exists(project_dir):
    os.makedirs(project_dir)

# 1. Buat file .prj
prj_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Project>
   <description></description>
   <name>Katalon_Test_Cases</name>
   <tag></tag>
   <UUID>{uuid.uuid4()}</UUID>
   <migratedVersion>5.9.0</migratedVersion>
   <pageLoadTimeout>0</pageLoadTimeout>
   <projectFileLocation>{project_dir}\\Katalon_Test_Cases.prj</projectFileLocation>
   <sourceContent>
      <sourceFolderList>
         <sourceFolderConfiguration>
            <url>Include/scripts/groovy</url>
         </sourceFolderConfiguration>
      </sourceFolderList>
      <systemFolderList>
         <systemFolderConfiguration>
            <url>Include/scripts/groovy</url>
         </systemFolderConfiguration>
         <systemFolderConfiguration>
            <url>Include/features</url>
         </systemFolderConfiguration>
         <systemFolderConfiguration>
            <url>Include/config</url>
         </systemFolderConfiguration>
      </systemFolderList>
   </sourceContent>
   <timeStampInProperties>false</timeStampInProperties>
   <type>WEBUI</type>
</Project>
"""
with open(os.path.join(project_dir, "Katalon_Test_Cases.prj"), "w") as f:
    f.write(prj_content)

# 2. Buat file konfigurasi project Eclipse/Katalon
project_content = """<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>Katalon_Test_Cases</name>
	<comment></comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>org.eclipse.jdt.core.javabuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>org.eclipse.jdt.groovy.core.groovyNature</nature>
		<nature>org.eclipse.jdt.core.javanature</nature>
	</natures>
</projectDescription>"""
with open(os.path.join(project_dir, ".project"), "w") as f:
    f.write(project_content)

classpath_content = """<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER"/>
	<classpathentry kind="con" path="com.kms.katalon.core.testobject.testObjectContainer"/>
	<classpathentry kind="output" path="bin"/>
</classpath>"""
with open(os.path.join(project_dir, ".classpath"), "w") as f:
    f.write(classpath_content)

# 3. Buat direktori struktur dasar Katalon
dirs = ["Test Cases", "Scripts", "Object Repository", "Profiles", "Test Suites", "Include"]
for d in dirs:
    os.makedirs(os.path.join(project_dir, d), exist_ok=True)

# 4. Pindahkan dan konversi file .groovy yang sudah dibuat
groovy_files = glob.glob(os.path.join(project_dir, "*", "*.groovy"))

for gf in groovy_files:
    rel_path = os.path.relpath(gf, project_dir) # misal: Admin_Feature\TC01_Login_Admin.groovy
    dir_name = os.path.dirname(rel_path) # misal: Admin_Feature
    base_name = os.path.basename(gf).replace(".groovy", "") # misal: TC01_Login_Admin
    
    # a. Buat file .tc (Test Case Meta)
    tc_dir = os.path.join(project_dir, "Test Cases", dir_name)
    os.makedirs(tc_dir, exist_ok=True)
    tc_uuid = str(uuid.uuid4())
    tc_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<TestCaseEntity>
   <description></description>
   <name>{base_name}</name>
   <tag></tag>
   <comment></comment>
   <testCaseGuid>{tc_uuid}</testCaseGuid>
</TestCaseEntity>"""
    with open(os.path.join(tc_dir, f"{base_name}.tc"), "w") as f:
        f.write(tc_content)
        
    # b. Buat file groovy (Script aktual)
    script_dir = os.path.join(project_dir, "Scripts", dir_name, base_name)
    os.makedirs(script_dir, exist_ok=True)
    
    with open(gf, "r", encoding="utf-8") as f:
        code = f.read()
        
    # Simpan ke format Scriptxxxxx.groovy
    with open(os.path.join(script_dir, "Script1700000000000.groovy"), "w", encoding="utf-8") as f:
        f.write(code)
        
    # c. Hapus file groovy mentah
    os.remove(gf)

# Bersihkan direktori kosong yang lama
for d in os.listdir(project_dir):
    full_path = os.path.join(project_dir, d)
    if os.path.isdir(full_path) and not os.listdir(full_path):
        os.rmdir(full_path)

print("Katalon project successfully configured!")
