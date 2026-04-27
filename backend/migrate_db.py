import sqlite3
conn = sqlite3.connect('fintech.db')
cur = conn.cursor()
cur.execute("PRAGMA table_info(users)")
cols = [row[1] for row in cur.fetchall()]
print('Existing columns:', cols)
to_add = {
    'password_hash': 'TEXT NOT NULL DEFAULT ""',
    'email': 'TEXT',
    'full_name': 'TEXT',
    'security_question': 'TEXT',
    'security_answer': 'TEXT',
    'is_admin': 'INTEGER DEFAULT 0',
    'is_active': 'INTEGER DEFAULT 1',
    'last_login': 'DATETIME'
}
for col, typ in to_add.items():
    if col not in cols:
        cur.execute(f'ALTER TABLE users ADD COLUMN {col} {typ}')
        print(f'Added column: {col}')
conn.commit()
conn.close()
print('Migration complete')
