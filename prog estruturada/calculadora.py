class calculadora:
    def __init__(self):
        self.valor1 = 0
        self.valor2 = 0
        self.valor_total = 0

    def soma(self):
        self.valor_total = self.valor1 + self.valor2
        return self.valor_total
    
    def subtracao(self):
        self.valor_total = self.valor1 - self.valor2
        return self.valor_total

    def multiplicacao(self):
        self.valor_total = self.valor1 * self.valor2
        return self.valor_total

    def divisao(self):
        if self.valor2 == 0:
            return "Erro: Divisão por zero!"
        self.valor_total = self.valor1 / self.valor2
        return self.valor_total

    def apagar(self):
        self.valor_total = 0
        return self.valor_total

    lista_func = [apagar, soma, subtracao, multiplicacao, divisao]

def getNum():
    while True:
        try:
            num = float(input('Digite um número: '))
            return num
        except ValueError:
            print('ERRO: Valor de entrada inválido!')

def menu():
    print('''
    1. Somar
    2. Subtrair
    3. Multiplicar
    4. Dividir

    0. Apagar
''')
    return input('>>> ')

operacao = calculadora()
while True:
    try:
        operacao.valor1 = getNum()
        operacao.valor2 = getNum()

        while True:
            escolha = menu()

            for e in ['0', '1', '2', '3', '4']:
                if escolha == e:
                    print(f'O resultado da operação é: {operacao.lista_func[int(e)](operacao):.2f}')
                    break

            if escolha == '0':
                print('Valores apagados!')
                break

            operacao.valor1 = operacao.valor_total
            operacao.valor2 = getNum()
    except KeyboardInterrupt:
        print('\nPrograma encerrado!')
        break
    except:
        print('Ocorreu um erro inesperado. Tente novamente.')
