from pathlib import Path
lista_infos = []

def calcular_media(lista_valores):
	"""Calcula a média aritimética de uma listade valores
	e a retorna

	Args:
		lista_valores (list): lista coms os valores.

	Returns:
		float: a média aritimética dos valores.
	"""

	return sum(lista_valores) / len(lista_valores)

def separarDados(string, separador=';'):
	"""Separa uma string por meio se um separador padrão,
	ou por um separador passado na chamada da função e retorna
	uma lista com os valores divididos.

	Args:
		string (str): O texto a ser separado.
		separador (str, optional): O valor usado para separar a string.

	Returns:
		list: Uma lista com as strings separadas.
	"""

	return string.split(separador)

def definir_situacao(media, media_corte=7):
	"""Compara uma média e verifica sua situação em relação a um valor de corte.

	Args:
		media (float): Média a ser comparada.
		media_corte (int, optional): Valor de corte para tomar uma decisão.

	Returns:
		str: Um texto indicando a situação do estudante.
	"""

	if media >= media_corte:
		return 'Aprovado'
	else:
		return 'Reprovado'

def contagemInfos(lista, comparacao):
	soma = 0
	for e in lista:
		if e[-1] == comparacao:
			soma += 1
	return soma

def coleta_caminho():
	"""Coleta o caminho do arquivo e verifica se ele existe.

	Returns:
		Path: O caminho do arquivo.

	Raises:
		FileNotFoundError: Caso o arquivo não exista.
	"""

	caminho = Path().resolve()
	if not caminho.exists():
		raise FileNotFoundError
	return caminho

def verif_nome_arquivo(nome_arquivo):
	"""Verifica se o nome do arquivo é válido.

	Args:
		nome_arquivo (str): O nome do arquivo a ser verificado.

	Returns:
		bool: True se o nome do arquivo for válido, False caso contrário.
	"""

	if not nome_arquivo.endswith('.txt'):
		return False
	return True

def carregar_arquivo(arquivo_entrada):
	global lista_infos
	if not verif_nome_arquivo(arquivo_entrada):
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
		return False

	else:
		arquivo_entrada = str(coleta_caminho()) + '\\' + arquivo_entrada
		with open(arquivo_entrada, 'r', encoding='utf-8') as file:
			for lin in file.readlines():
				dados = separarDados(lin)
				media = calcular_media([float(dados[1]), float(dados[2])])
				situacao = definir_situacao(media)
				lista_infos.append([dados[0], media, situacao])

		return True

def salvar_arquivo(arquivo_saida):
	global lista_infos
	if not verif_nome_arquivo(arquivo_saida):
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
		return False

	arquivo_saida = str(coleta_caminho()) + '\\' + arquivo_saida
	with open(arquivo_saida, 'w', encoding='utf-8') as f:
		aprovados = contagemInfos(lista_infos, 'Aprovado')
		prova_final = contagemInfos(lista_infos, 'Prova Final')
		reprovados = contagemInfos(lista_infos, 'Reprovado')
		f.write(f'''
=======================
n° de aprovados: {aprovados}
n° de provas finais: {prova_final}
n° de reprovados: {reprovados}
=======================
''')
		for inf in lista_infos:
			f.write(f'{inf[0]}\nMédia: {inf[1]:.2f} {inf[2]}\n')
			f.write('\n')
	return True

if __name__ == '__main__':
	try:
		while True:
			arquivo_entrada = input('Digite o nome do arquivo de entrada: ')
			verificacao = carregar_arquivo(arquivo_entrada)
			if not verificacao:
				continue

			while True:
				arquivo_saida = input('Digite o nome do arquivo de saída: ')
				verif = salvar_arquivo(arquivo_saida)
				if not verif:
					continue
				else:
					break
			break
			
	except FileNotFoundError:
		print('Arquivo inválido. O arquivo deve ter a extensão .txt')
	except:
		print('Ocorreu um erro inesperado. Tente novamente.')