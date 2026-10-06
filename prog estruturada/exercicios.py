# Pedro Henrique de Oliveira
#============================

# ----------------------------------------------------------------------------------
# exercício 1:
def ColetaAno():
    return int(input('Digite seu ano de nascimento: '))
def CalculaIdade(ano_nascimento):
    return 2026 - ano_nascimento

def exercicio1():
    ano = ColetaAno()
    print(f'você tem {CalculaIdade(ano)} anos de idade')

# ----------------------------------------------------------------------------------
# exercício 2:
def ColetaNumero():
    return float(input('digite um número: '))
def Menu():
    print('''
escolha uma operação (digite os numeros de 1 a 4):
1. soma
2. subtração
3. multiplicação
4. divisão
''')
    return input('>>> ')

def exercicio2():
    n1 = ColetaNumero()
    n2 = ColetaNumero()
    operacao = Menu()

    if operacao == '1':
        print(n1+n2)
    elif operacao == '2':
        print(n1-n2)
    elif operacao == '3':
        print(n1*n2)
    elif operacao == '4':
        print(n1/n2)
    else:
        print('ERRO: digite apenas uma das opções (números de 1 a 4)!')

# ----------------------------------------------------------------------------------
# exercício 3:

def exercicio3():
    numero = ColetaNumero() # reutilizei a função do exercício 2

    print(f'{numero} é par') if numero % 2 == 0 else print(f'{numero} é ímpar')

# ----------------------------------------------------------------------------------
# exercício 4:
def ColetaNotas(quantidade_notas):
    soma_notas = 0
    for e in range(quantidade_notas):
        soma_notas += float(input(f'digite sua nota {e+1}: '))
    return soma_notas
def CalculaMedia(nota, quantidade_notas):
    return nota / quantidade_notas

def exercicio4():
    notas = ColetaNotas(3)
    media = CalculaMedia(notas, 3)
    print(f'Média: {media}')

    if media >= 7:
        print('Aprovado!')
    elif media >= 5:
        print('Recuperação!')
    else:
        print('Reprovado!')

# ----------------------------------------------------------------------------------
# exercício 5:
def exercicio5():
    numero = ColetaNumero() # reutilizei a mesma função do exercício 2

    for e in range(1,11):
        print(f'{numero} x {e} = {numero*e}')

# ----------------------------------------------------------------------------------
# exercício 6:
def ColetaTemp():
    return float(input('digite uma temperatura em graus celsius: '))
def ConverteTemp(temp_celsius):
    return (temp_celsius * 9 / 5) + 32

def exercicio6():
    temperatura = ColetaTemp()
    print(f'{temperatura}°C --> {ConverteTemp(temperatura)}°F')

# ----------------------------------------------------------------------------------
# exercício 7:
def MenuJurosSimples():
    print('''
Taxa ao mês ou ao ano:
1. Ao mês
2. Ao ano
''')
    return input('>>> ')

def ColetaCapital():
    return float(input('digite o capital: '))

def ColetaTaxa():
    periodo = MenuJurosSimples()

    if periodo == '1':
        return float(input('digite a taxa ao mês: ')), 'meses'
    elif periodo == '2':
        return float(input('digite a taxa ao ano: ')), 'anos'
    else:
        print('ERRO: digite apenas uma das opções (números de 1 ou 2)!')
        return ColetaTaxa()

def ColetaTempo():
    return float(input('digite o tempo: '))

def CalculaJuros(capital, taxa, tempo):
    juros = capital*taxa*tempo
    return juros

def exercicio7():
    capital = ColetaCapital()
    taxa, periodo = ColetaTaxa()
    tempo = ColetaTempo()

    print(f'o valor dos juros simples de R$ {capital:.2f} aplicados durante {int(tempo)} {periodo} é: R$ {CalculaJuros(capital,taxa,tempo):.2f}')
    print(f'valor total após {tempo} {periodo}: R$ {capital + CalculaJuros(capital,taxa,tempo):.2f}')

# ----------------------------------------------------------------------------------
# exercício 8:
def ColetaPeso():
    return float(input('Digite seu peso em kg: '))

def ColetaAltura():
    return float(input('Digite sua altura em metros: '))

def CalculaImc(peso, altura):
    return peso / (altura**2)

def exercicio8():
    peso = ColetaPeso()
    altura = ColetaAltura()
    print(f'Seu IMC é: {CalculaImc(peso,altura):.2f}')

def MenuPrincipal():
    print('''
LISTA DE EXERCÍCIOS
===================

1. Calcular idade
2. Calculadora
3. Verificar se número é par ou ímpar
4. Calcular média
5. Tabuada
6. Converter temperatura de Celsius para Fahrenheit
7. Calcular juros simples
8. Calcular IMC
0. Sair
''')
    return input('>>> ')

while True:
    opcao = MenuPrincipal()

    if opcao == '1':
        exercicio1()
    elif opcao == '2':
        exercicio2()
    elif opcao == '3':
        exercicio3()
    elif opcao == '4':
        exercicio4()
    elif opcao == '5':
        exercicio5()
    elif opcao == '6':
        exercicio6()
    elif opcao == '7':
        exercicio7()
    elif opcao == '8':
        exercicio8()
    elif opcao == '0':
        break
    else:
        print('ERRO: digite apenas uma das opções (números de 1 a 8)!')
    input('pressione ENTER para continuar')
    print('\n'*100)