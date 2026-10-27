# arquivo = open('./prog estruturada/file.txt', 'w', encoding='utf-8')

# arquivo.write('Esse é um teste. Isso também é um teste.\n')
# arquivo.write('qualquer coisa aqui.\n')
# arquivo.write('kkkk\n')

# arquivo.close()

import datetime

with open(f'./prog estruturada/file.txt', 'a', encoding='utf-8') as f:
    f.write(f'''Esse é um teste. Isso também é um teste.
qualquer coisa aqui.
kkkk

{datetime.datetime.now().strftime("%d/%m/%y %H:%M")}''')

# with open('./prog estruturada/file.txt', 'r', encoding='utf-8') as f:
#     for lin in f.readlines():
#         print(lin)
