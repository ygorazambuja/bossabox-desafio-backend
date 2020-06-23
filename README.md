# VUTTR - Bossabox Desafio Backend

## Descrição

Api construida em **Node.js** utilizando **Typescript** para o desafio Bossabox Backend - VUTTR ( Very Useful Tools to Remember )

## Documentação da API

A Documentação foi criada utilizando os padrões da OpenAPI 3.0, [e aqui está o link para acessá-la](https://app.swaggerhub.com/apis/ygorazambuja/bossabox-vuttr/0.1)

## CI/CD

A API está hospeada no heroku, seu código fonte está hospedado no Github, o seus stages são executados no Gitlab.

No [Github](https://github.com/ygorazambuja/bossabox-desafio-backend) é feito os _commits_ e _pushs_, que são espelhados no [Gitlab](https://gitlab.com/ygorazambuja/bossabox-desafio-backend) onde começa o trabalho do _pipeline_.

### Gitlab

No Gitlab são executados 1 *pipeline* com 3 _stages_

1. install_dependencies
   São baixados todos os pacotes necessarios para o **NPM** (_Node Package Manager_) deixar todas as dependencias necessarias para executar todos os testes e _buildar_ a aplicação.

2. testing
   Nesse _stage_ são executados os testes escritos em **Typescript** utilizando o **Jest** para a aplicação não ser jogada em produção com possiveis problemas.

3. production
   Agora executamos um ambiente docker para executar uma ferramenta de _Deploy_ [DPL](https://docs.gitlab.com/ee/ci/examples/deployment/) onde ele vai checar as minhas variaveis de ambientes do **Heroku**, como nome da aplicação e minha chave privada, então a aplicação vai para o **Heroku**

### Heroku

No Heroku, foi configurado um **MongoDB** Gratuito Sandbox de 500mb, e é feito o deploy com um **Dockerfile**, nesse **Dockerfile**, eu baixo as dependencias, buildo a aplicação e exponho a porta 3000 da minha aplicação, pra não dar erros de porta no Heroku, então exponho a 3000 e eles decidem qual porta eles irão hospedar no servidor deles.

## Ambiente de Testes

Aqui foram utilizados as bibliotecas **jest**, **ts-jest**, **supertest**, juntamente com o **mongo-memory-server** para simular um banco de dados MongoDB temporario, **faker** para gerar dados automatizados.

## Ambiente de Desenvolvimento

**Eslint, Husky, Lint Staged, Babel, Typescript, SonarScanner, Nodemon**

Foi Configurado o **eslint** padronizado para o [**standard**](https://standardjs.com/readme-ptbr.html) **style guide**

**Husky**, **Lint Staged** e **git-commit-msg-linter** para não comitarmos [fora do padrão da convenção](https://www.conventionalcommits.org/en/v1.0.0/) e não comitarmos um código quebrado, porque antes de proceder com o commit o código é testado, se ocorrer algum problema o commit é cancelado.

**Babel** para transpilação do código **Typescript** para **Javascript** e para utilizarmos um plugin de _module-resolver_ que faz a tradução dos _paths_.

Exemplo:

```javascript
import { IUserDocument } from "@interfaces/user.interface";
// tambem poderia ser
import { IUserDocument } from "../../user.interface";
// dependendo de quão profundo o arquivo está na arvore de diretorios
```

**SonarScanner** foi utilizado juntamente com o [**SonarQube**](https://www.sonarqube.org/) para melhorar a qualidade do código.

Link do [SonarQube docker-compose.yml](sonarscanner-docker-compose.yml)

**Nodemon** para live-reload da aplicação enquanto desenvolvemos.


Para executarmos a aplicação em ambiente de desenvolvimento precisamos ter uma instancia do mongodb rodando na porta **27017**, deixei a execução do **mongodb** por conta do **Docker** no [ShellScript](mongodb-dev.sh)


MongoDB rodando, é só executar no terminal ```npm run dev```

## Aplicação de Fato

Como o solicitado, foi feitas as rotas primeiramente _Sem autenticação_, porem como bonus foram feitas as mesmas rotas utilizando autenticação _JWT_, e para criação dos usuarios foi feito um simples cadastro de usuário.

### Rotas

## [Para mais detalhes da Api, aqui está a Documentação hospedada](https://app.swaggerhub.com/apis/ygorazambuja/bossabox-vuttr/0.1)

[E aqui a documentação local](api/swagger/swagger.yaml)

#### Tools

- GET /tools
- GET /tools/toolId
- POST /tools
- DELETE /tools/toolId
- PUT /tools

#### Users

- GET /users
- GET /users/userId
- POST /users
- DELETE /users/userId
- PUT /users

#### Authentication

- POST /auth/signIn
- POST /auth/logIn
