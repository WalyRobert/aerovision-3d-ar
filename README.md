# AeroVision 3D AR

Visualizador experimental de modelos 3D com câmera de fundo opcional. Autor: Waly Robert. Derivado do projeto no Google AI Studio, com importação autocontida, liberação de recursos e descrição do escopo real.

## Executar

Node.js 22.16 ou superior. `npm ci`, `npm run dev`. A cena inicial usa um nó toroidal procedural, sem assets externos. Arraste para girar e use roda/pinça para zoom. `npm run build` e `npm run preview` validam e servem o build estático em `dist/`.

## Modelos e câmera

- Importe um **GLB 2.0 autocontido** de até 20 MB, bloco JSON até 1 MB, até um milhão de triângulos. Exporte sem Draco, Meshopt ou KTX2; recursos externos são rejeitados. GLTF JSON com arquivos separados não é suportado nesta edição. Malhas/texturas complexas ainda podem exceder memória do dispositivo.
- O carregador normaliza o modelo para caber na cena. Isso altera a escala de apresentação e não representa dimensões físicas reais. Não há execução de animações nesta interface.
- Troca/remoção de modelo libera geometria, materiais, texturas e esqueletos. Câmera só inicia após botão explícito; streams concedidos após sair da tela são encerrados. Não captura áudio.
- O botão de câmera precisa de HTTPS/localhost e permissão. A imagem é apenas um fundo visual da cena Three.js. Sem WebXR, hit-test, detecção de superfície, ancoragem ou calibração de escala.
- Sem upload para IA, chat, captura combinada ou “análise do que estou vendo”: o botão original de snapshot apenas enviava texto de contexto, então essa promessa não é apresentada como função pronta.

Arquivos e frames permanecem no navegador. Use modelos e imagens autorizados. Recursos externos de modelos são bloqueados; não se trata de sandbox para arquivos hostis. Evite modelos não confiáveis e mantenha o navegador atualizado.

## Verificação

`npm test` e `npm run build`. Testes carregam um GLB real mínimo com GLTFLoader, verificam normalização, rejeição de recursos externos e limpeza de câmera/modelo. O CI repete esses comandos. Não substituem testes WebGL/câmera em dispositivos reais ou validação de todos os exportadores GLB.

Stack: React, TypeScript, Three.js, React Three Fiber e Drei. Esta edição adapta a interface para execução portátil; o projeto do Studio não é sobrescrito. Licença de redistribuição do código ainda não definida pelo autor; dependências mantêm suas próprias licenças.


## Início e diagnóstico simplificados

Após `npm ci`, execute `npm run diagnostico` para verificar Node, dependências, build e presença de configuração sem revelar chaves ou consumir cota. Execute `npm run iniciar` para compilar a versão atual e abrir o servidor local em um único terminal. A faixa de estado da interface distingue configuração ausente e integração ainda não comprovada. Encontrar uma chave não confirma que ela é válida nem que existe cota gratuita. Nenhum teste de geração é iniciado automaticamente.
