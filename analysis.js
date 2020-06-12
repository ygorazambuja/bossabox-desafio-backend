const scanner = require('sonarqube-scanner')

scanner(
  {
    serverUrl: 'http://localhost:9000/',
    options: {
      'sonar.projectName': 'bossabox-backend',
      'sonar.projectDescription': 'Desafio backend para portifólio na Bossabox',
      'sonar.projectVersion': '1.1.0',
      'sonar.sources': 'src'
    }
  },
  () => {}
)
