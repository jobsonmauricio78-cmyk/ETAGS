// Lembranças padrão do álbum, geradas a partir da pasta /albuns
const FRAME_BY_COLLECTION = {
  "Românticas": "frame-gold",
  "Viagens": "frame-vintage",
  "Fotos do dia": "frame-polaroid",
  "Descontraídas": "frame-film"
};

function makeMemory(id, title, collection, description, date, media, type) {
  return {
    id: String(id),
    title,
    collection,
    description,
    date,
    media: `albuns/${media}`,
    type,
    frame: FRAME_BY_COLLECTION[collection] || "frame-polaroid",
    builtin: true
  };
}

const DEFAULT_MEMORIES = [
  makeMemory(1, "Primeiro encontro", "Românticas", "nunca vou me esquecer desse dia, do nervosismo antes de te encontrar ao mesmo tempo que tudo ficou tão leve quando eu te vi, de como vc tava linda, um anjo andando comigo pelos corredores do shopping e comendo um hamburger, do nosso selinho de despedida tímido antes da sua mãe chegar, tudo perfeito", "2026-05-21", "1.jpeg", "image"),
  makeMemory(2, "O dia tão especial", "Viagens", "nossa primeira foto juntos, no dia do nosso primeiro beijo, um dia tão inesquecível que rendeu noites e noites seguidas apenas conversando sobre esse dia", "2026-05-22", "2.jpeg", "image"),
  makeMemory(3, "Tímida mandando foto pra minha mãe", "Fotos do dia", "época que ainda tinha vergonha de mim", "2026-05-28", "3.jpeg", "image"),
  makeMemory(4, "Saindo com manu", "Fotos do dia", "primeira foto que você postou cmg (no daily mas foi), sem contar a vela sinistra que você fez sua amiga segurar kkkkk", "2026-06-07", "4.jpeg", "image"),
  makeMemory(5, "Primeiro dia dos namorados", "Românticas", "aqui você finalmente estava se deixando ser amada, e mesmo com alguns problemas, não deixamos de fazer de tudo para nos encontrar e fazer dar certo, incrível como o tempo passou tão rápido e o clima fica tão bom com você, desde sempre (nossa musica de fundo)", "2026-06-11", "5.mp4", "video"),
  makeMemory(6, "Dia dos namorados na escola", "Românticas", "você VERMELHA recebendo o buquê, e mais vermelha ainda recebendo um selinho na frente de todo mundo (muito fofa)", "2026-06-12", "6.jpeg", "image"),
  makeMemory(7, "Eu fazendo merda e você pegando confiança por mim", "Descontraídas", "sem comentários pra burrice que eu fiz kkkkk (pelo menos resolvi)", "2026-06-13", "7.jpeg", "image"),
  makeMemory(8, "Primeira vez de muitas na sua casa", "Fotos do dia", "assistindo todo mundo odeia o chris", "2026-06-15", "8.jpeg", "image"),
  makeMemory(9, "idiotas kkkk", "Descontraídas", "fofos", "2026-06-15", "9.mp4", "video"),
  makeMemory(10, "Meu aniversário", "Fotos do dia", "você guardando a surpresa de mim sorrateiramente, e ainda foi o dia que você conheceu minha familia inteira, e entrosou com minha irmã e as amigas dela, conquistando o coração de todos sendo a menina mais divertida do mundo, como você sempre é", "2026-06-16", "10.jpeg", "image"),
  makeMemory(11, "MUITO FOFA", "Descontraídas", "não aguento com esses olhos, desde sempre é só você fazer essa cara que eu não resisto", "2026-06-19", "11.jpeg", "image"),
  makeMemory(12, "O pedido", "Românticas", "exatamente 3 meses atrás", "2026-06-26", "12.jpeg", "image"),
  makeMemory(13, "Ela nem desconfiava", "Fotos do dia", "Pov desconfiava, e MUITO, mas a gente esquece essa parte (vc estava linda como sempre, e eu nervoso quase desmaiando)", "2026-06-26", "13.jpeg", "image"),
  makeMemory(14, "apenas Us KKKKKKKKK", "Descontraídas", "muita maturidade", "2026-06-28", "14.jpeg", "image"),
  makeMemory(15, "nossa festa junina", "Românticas", "um dia muito especial para nós, pelo menos pra mim foi, daria tudo pra dançar com você de novo", "2026-07-19", "15.jpeg", "image"),
  makeMemory(16, "????????", "Descontraídas", "Luiza indignada no fundo kkkkk", "2026-07-19", "16.jpeg", "image"),
  makeMemory(17, "Primeira viagem juntos (com seus pais)", "Românticas", "Nós em grussacity curtindo uma praia (tomando caldo e pegando sol no vento)", "2026-08-02", "17.jpeg", "image"),
  makeMemory(18, "Turistando por são João", "Românticas", "Linda essa foto, e esse dia foi MUITO incrível (nascimento da piada do pastel)", "2026-08-02", "18.jpeg", "image"),
  makeMemory(19, "Calúnia.", "Descontraídas", "Jogando Roblox com Giulia e tendo um tempo de qualidade (nada a comentar sobre a foto)", "2026-08-26", "19.jpeg", "image"),
  makeMemory(20, "Aniversário de 2 meses", "Românticas", "Comida boa, melhor sushi de campos e 200 reais de entrada, isso sem contar o casal se comendo na nossa frente, mas compensou por estar com você <3 (e pelo tiramisu)", "2026-08-29", "20.jpeg", "image"),
  makeMemory(21, "Indo pra VV", "Descontraídas", "eu claramente bem confortável, e vc se divertindo", "2026-09-12", "21.jpeg", "image"),
  makeMemory(22, "Nós vendo a paisagem", "Fotos do dia", "orla da praia, por do sol, pós patinete e pré sorvete junto com o amor da minha vida. perfeito.", "2026-09-12", "22.jpeg", "image"),
  makeMemory(23, "Vc sendo vc", "Descontraídas", "Essa foto é mt nós kkkkk", "2026-09-13", "23.jpeg", "image"),
  makeMemory(24, "Casal americano padrão", "Românticas", "Um dia perfeito ao lado do meu amor, colecionando momentos e memórias que ficarão para sempre", "2026-09-13", "24.jpeg", "image"),
  makeMemory(25, "Te ajudando na feira", "Descontraídas", "eu sendo o homem da relação dominando o ser inferior (mulher)", "2026-09-16", "25.jpeg", "image"),
  makeMemory(26, "Fazendo torta", "Descontraídas", "nós sendo apenas dois apaixonados felizes", "2026-09-21", "26.jpeg", "image")
];
