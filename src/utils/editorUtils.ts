
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

export interface HistoryAction {
  id: string;
  timestamp: Date;
  description: string;
  htmlContent: string;
}

// Estrutura para definição de temas
export interface ThemeStyles {
  mainColor: string;
  fontFamily: string;
  buttonStyle: string;
  layoutType: string;
}

// Gera um HTML baseado no prompt e tema selecionado
export const generateHtmlFromPrompt = (prompt: string, content?: any, themeStyles?: ThemeStyles): string => {
  console.log("Gerando HTML com prompt:", prompt);
  
  // Extrair informações do prompt para personalização
  const promptLower = prompt.toLowerCase();
  const isLoja = promptLower.includes("loja") || promptLower.includes("produtos") || promptLower.includes("venda");
  const isPortfolio = promptLower.includes("portfólio") || promptLower.includes("portfolio") || promptLower.includes("trabalhos");
  const isRestaurante = promptLower.includes("restaurante") || promptLower.includes("comida") || promptLower.includes("menu");
  const isBlog = promptLower.includes("blog") || promptLower.includes("notícias") || promptLower.includes("artigos");
  const isServico = promptLower.includes("serviço") || promptLower.includes("serviços") || promptLower.includes("profissional");
  
  // Definir título com base no tipo de site
  const title = content?.siteName || (
    isLoja ? "Minha Loja Online" : 
    isPortfolio ? "Meu Portfólio Profissional" : 
    isRestaurante ? "Meu Restaurante" :
    isBlog ? "Meu Blog" :
    isServico ? "Meus Serviços" : "Meu Site"
  );
  
  // Definir conteúdo da seção hero
  const heroHeadline = content?.heroSection?.headline || (
    isLoja ? "Produtos exclusivos para você" :
    isPortfolio ? "Criatividade & Profissionalismo" :
    isRestaurante ? "Sabor e qualidade em cada prato" :
    isBlog ? "Informação que importa" :
    isServico ? "Soluções profissionais para suas necessidades" : "Bem-vindo ao nosso site"
  );
  
  const heroDescription = content?.heroSection?.description || (
    isLoja ? "Encontre os melhores produtos com os melhores preços" :
    isPortfolio ? "Confira meus trabalhos e projetos realizados" :
    isRestaurante ? "Uma experiência gastronômica inesquecível" :
    isBlog ? "Fique por dentro das últimas novidades" :
    isServico ? "Oferecemos serviços de alta qualidade com profissionais experientes" : 
    "Um site incrível criado com PromptSites"
  );
  
  // Definir conteúdo sobre
  const aboutText = content?.about || (
    isLoja ? "Nossa loja foi fundada com o objetivo de oferecer produtos de alta qualidade a preços justos." :
    isPortfolio ? "Sou um profissional dedicado a criar soluções criativas e eficientes para meus clientes." :
    isRestaurante ? "Nosso restaurante tem como missão proporcionar uma experiência gastronômica única, com ingredientes frescos e de qualidade." :
    isBlog ? "Este blog foi criado para compartilhar informações relevantes e atualizadas sobre os assuntos que mais importam." :
    isServico ? "Nossa empresa oferece serviços especializados com a garantia de qualidade e satisfação." :
    "Este é um site gerado automaticamente com base na sua descrição. Você pode personalizar todo o conteúdo através do chat de IA."
  );
  
  // Definir CTA
  const ctaText = content?.cta?.[0] || (
    isLoja ? "Ver produtos" :
    isPortfolio ? "Ver projetos" :
    isRestaurante ? "Ver cardápio" :
    isBlog ? "Ler artigos" :
    isServico ? "Solicitar orçamento" : "Entre em contato"
  );
  
  // Definir cores e estilos
  const mainColor = themeStyles?.mainColor || (
    promptLower.includes("azul") ? "#1a73e8" : 
    promptLower.includes("verde") ? "#0f9d58" : 
    promptLower.includes("vermelho") ? "#ea4335" :
    promptLower.includes("roxo") ? "#9c27b0" :
    promptLower.includes("laranja") ? "#ff9800" :
    promptLower.includes("rosa") ? "#e91e63" :
    promptLower.includes("amarelo") ? "#ffc107" :
    promptLower.includes("preto") ? "#212121" :
    isLoja ? "#4285f4" :
    isPortfolio ? "#9c27b0" :
    isRestaurante ? "#ff9800" :
    isBlog ? "#0f9d58" :
    isServico ? "#1a73e8" : "#1a73e8"
  );
  
  // Escolher fonte com base no tipo de site ou tema
  const fontFamily = themeStyles?.fontFamily || (
    isLoja ? "'Montserrat', sans-serif" :
    isPortfolio ? "'Playfair Display', serif" :
    isRestaurante ? "'Lora', serif" :
    isBlog ? "'Merriweather', serif" :
    isServico ? "'Open Sans', sans-serif" : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  );
  
  // Definir estilo do botão
  const buttonStyle = themeStyles?.buttonStyle || (
    isLoja ? "rounded-full" :
    isPortfolio ? "rounded" :
    isRestaurante ? "rounded-lg" :
    isBlog ? "rounded" :
    isServico ? "rounded-md" : "rounded"
  );
  
  // Determinar tipo de layout
  const layoutType = themeStyles?.layoutType || (
    isLoja ? "grid" :
    isPortfolio ? "masonry" :
    isRestaurante ? "card" :
    isBlog ? "list" :
    isServico ? "feature" : "default"
  );
  
  // Gerando os elementos específicos com base no tipo de site
  let specificContent = '';
  
  if (isLoja) {
    specificContent = `
      <div class="section">
        <h2>Nossos Produtos em Destaque</h2>
        <div class="product-grid">
          <div class="product-card">
            <div class="product-image"><img src="https://via.placeholder.com/300x300?text=Produto+1" alt="Produto 1"></div>
            <h3>Produto 1</h3>
            <p class="price">R$ 99,90</p>
            <p>Uma descrição detalhada deste produto incrível que você precisa ter.</p>
            <button class="btn">Comprar agora</button>
          </div>
          <div class="product-card">
            <div class="product-image"><img src="https://via.placeholder.com/300x300?text=Produto+2" alt="Produto 2"></div>
            <h3>Produto 2</h3>
            <p class="price">R$ 129,90</p>
            <p>Uma descrição detalhada deste produto incrível que você precisa ter.</p>
            <button class="btn">Comprar agora</button>
          </div>
          <div class="product-card">
            <div class="product-image"><img src="https://via.placeholder.com/300x300?text=Produto+3" alt="Produto 3"></div>
            <h3>Produto 3</h3>
            <p class="price">R$ 79,90</p>
            <p>Uma descrição detalhada deste produto incrível que você precisa ter.</p>
            <button class="btn">Comprar agora</button>
          </div>
        </div>
      </div>
      <div class="section highlight-section">
        <div class="container">
          <div class="highlight-content">
            <h2>Promoção Especial</h2>
            <p>Aproveite nossa oferta por tempo limitado. Use o cupom <strong>PROMO20</strong> e ganhe 20% de desconto em qualquer produto!</p>
            <button class="btn btn-large">Ver ofertas</button>
          </div>
        </div>
      </div>
    `;
  } else if (isPortfolio) {
    specificContent = `
      <div class="section">
        <h2>Meus Projetos</h2>
        <div class="portfolio-grid">
          <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400?text=Projeto+1" alt="Projeto 1">
            <div class="portfolio-overlay">
              <h3>Projeto 1</h3>
              <p>Design de Identidade Visual</p>
              <a href="#" class="btn btn-sm">Ver detalhes</a>
            </div>
          </div>
          <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400?text=Projeto+2" alt="Projeto 2">
            <div class="portfolio-overlay">
              <h3>Projeto 2</h3>
              <p>Design de Website</p>
              <a href="#" class="btn btn-sm">Ver detalhes</a>
            </div>
          </div>
          <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400?text=Projeto+3" alt="Projeto 3">
            <div class="portfolio-overlay">
              <h3>Projeto 3</h3>
              <p>Campanha de Marketing Digital</p>
              <a href="#" class="btn btn-sm">Ver detalhes</a>
            </div>
          </div>
          <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400?text=Projeto+4" alt="Projeto 4">
            <div class="portfolio-overlay">
              <h3>Projeto 4</h3>
              <p>Design de Aplicativo</p>
              <a href="#" class="btn btn-sm">Ver detalhes</a>
            </div>
          </div>
        </div>
      </div>
      <div class="section skills-section">
        <h2>Minhas Habilidades</h2>
        <div class="skills-grid">
          <div class="skill-item">
            <div class="skill-icon">🎨</div>
            <h3>Design Gráfico</h3>
            <div class="skill-bar"><div class="skill-progress" style="width: 95%"></div></div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">💻</div>
            <h3>Desenvolvimento Web</h3>
            <div class="skill-bar"><div class="skill-progress" style="width: 85%"></div></div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">📱</div>
            <h3>UI/UX Design</h3>
            <div class="skill-bar"><div class="skill-progress" style="width: 90%"></div></div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">📊</div>
            <h3>Marketing Digital</h3>
            <div class="skill-bar"><div class="skill-progress" style="width: 80%"></div></div>
          </div>
        </div>
      </div>
    `;
  } else if (isRestaurante) {
    specificContent = `
      <div class="section menu-section">
        <h2>Nosso Cardápio</h2>
        <div class="menu-categories">
          <button class="menu-category active">Entradas</button>
          <button class="menu-category">Pratos Principais</button>
          <button class="menu-category">Sobremesas</button>
          <button class="menu-category">Bebidas</button>
        </div>
        <div class="menu-items">
          <div class="menu-item">
            <div class="menu-item-info">
              <h3>Bruschetta Italiana</h3>
              <p>Tomate, manjericão, alho e azeite em fatias de pão italiano.</p>
            </div>
            <div class="menu-item-price">R$ 28,90</div>
          </div>
          <div class="menu-item">
            <div class="menu-item-info">
              <h3>Carpaccio de Carne</h3>
              <p>Finas fatias de carne crua com molho de alcaparras e parmesão.</p>
            </div>
            <div class="menu-item-price">R$ 32,90</div>
          </div>
          <div class="menu-item">
            <div class="menu-item-info">
              <h3>Camarão Empanado</h3>
              <p>Camarões crocantes servidos com molho especial da casa.</p>
            </div>
            <div class="menu-item-price">R$ 45,90</div>
          </div>
        </div>
      </div>
      <div class="section gallery-section">
        <h2>Ambiente</h2>
        <div class="gallery-grid">
          <div class="gallery-item"><img src="https://via.placeholder.com/500x300?text=Ambiente+1" alt="Ambiente do Restaurante"></div>
          <div class="gallery-item"><img src="https://via.placeholder.com/500x300?text=Ambiente+2" alt="Ambiente do Restaurante"></div>
          <div class="gallery-item"><img src="https://via.placeholder.com/500x300?text=Pratos+1" alt="Nossos Pratos"></div>
          <div class="gallery-item"><img src="https://via.placeholder.com/500x300?text=Pratos+2" alt="Nossos Pratos"></div>
        </div>
      </div>
    `;
  } else if (isBlog) {
    specificContent = `
      <div class="section blog-section">
        <h2>Artigos Recentes</h2>
        <div class="blog-grid">
          <div class="blog-post">
            <div class="blog-image">
              <img src="https://via.placeholder.com/800x450?text=Artigo+1" alt="Artigo 1">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">12 Abril, 2025</span>
                <span class="blog-category">Tecnologia</span>
              </div>
              <h3>Como a Inteligência Artificial está Transformando as Empresas</h3>
              <p>A inteligência artificial está revolucionando a forma como as empresas operam. Neste artigo, exploramos como essa tecnologia...</p>
              <a href="#" class="read-more">Ler mais</a>
            </div>
          </div>
          <div class="blog-post">
            <div class="blog-image">
              <img src="https://via.placeholder.com/800x450?text=Artigo+2" alt="Artigo 2">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">8 Abril, 2025</span>
                <span class="blog-category">Saúde</span>
              </div>
              <h3>Dicas para Manter uma Alimentação Saudável no Dia a Dia</h3>
              <p>Manter uma alimentação saudável pode ser desafiador no ritmo acelerado da vida moderna. Confira nossas dicas práticas...</p>
              <a href="#" class="read-more">Ler mais</a>
            </div>
          </div>
          <div class="blog-post">
            <div class="blog-image">
              <img src="https://via.placeholder.com/800x450?text=Artigo+3" alt="Artigo 3">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">2 Abril, 2025</span>
                <span class="blog-category">Negócios</span>
              </div>
              <h3>Estratégias de Marketing Digital para Pequenas Empresas</h3>
              <p>Descubra como pequenas empresas podem aproveitar o marketing digital para crescer e alcançar novos clientes...</p>
              <a href="#" class="read-more">Ler mais</a>
            </div>
          </div>
        </div>
        <div class="blog-pagination">
          <a href="#" class="pagination-item active">1</a>
          <a href="#" class="pagination-item">2</a>
          <a href="#" class="pagination-item">3</a>
          <a href="#" class="pagination-item next">Próximo →</a>
        </div>
      </div>
    `;
  } else if (isServico) {
    specificContent = `
      <div class="section services-section">
        <h2>Nossos Serviços</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">⚙️</div>
            <h3>Consultoria</h3>
            <p>Oferecemos consultoria especializada para ajudar sua empresa a alcançar melhores resultados.</p>
            <a href="#" class="btn">Saiba mais</a>
          </div>
          <div class="service-card">
            <div class="service-icon">🔍</div>
            <h3>Análise de Dados</h3>
            <p>Análise detalhada de dados para informar decisões estratégicas e impulsionar o crescimento.</p>
            <a href="#" class="btn">Saiba mais</a>
          </div>
          <div class="service-card">
            <div class="service-icon">💼</div>
            <h3>Gestão de Projetos</h3>
            <p>Gerenciamento completo de projetos, do planejamento à execução, com foco em resultados.</p>
            <a href="#" class="btn">Saiba mais</a>
          </div>
          <div class="service-card">
            <div class="service-icon">🚀</div>
            <h3>Marketing Digital</h3>
            <p>Estratégias de marketing digital personalizadas para aumentar sua presença online.</p>
            <a href="#" class="btn">Saiba mais</a>
          </div>
        </div>
      </div>
      <div class="section process-section">
        <h2>Nosso Processo</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Análise</h3>
            <p>Compreendemos suas necessidades e objetivos de negócio.</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Estratégia</h3>
            <p>Desenvolvemos um plano personalizado para sua empresa.</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Implementação</h3>
            <p>Executamos o plano com atenção aos detalhes e resultados.</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Acompanhamento</h3>
            <p>Monitoramos, ajustamos e melhoramos continuamente.</p>
          </div>
        </div>
      </div>
    `;
  } else {
    // Site genérico para outros tipos
    specificContent = `
      <div class="features">
        <div class="feature">
          <h3>Recurso 1</h3>
          <p>Uma descrição detalhada do primeiro recurso que torna seu negócio especial.</p>
        </div>
        <div class="feature">
          <h3>Recurso 2</h3>
          <p>Uma descrição detalhada do segundo recurso que torna seu negócio especial.</p>
        </div>
        <div class="feature">
          <h3>Recurso 3</h3>
          <p>Uma descrição detalhada do terceiro recurso que torna seu negócio especial.</p>
        </div>
      </div>
    `;
  }
  
  // Montar o CSS específico com base no tipo de site e tema
  let specificCSS = '';
  
  if (isLoja) {
    specificCSS = `
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 30px;
        margin-top: 30px;
      }
      .product-card {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      .product-image {
        height: 200px;
        overflow: hidden;
      }
      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      .product-card:hover .product-image img {
        transform: scale(1.05);
      }
      .product-card h3 {
        margin: 15px 15px 5px;
        font-size: 1.2rem;
      }
      .product-card .price {
        font-weight: bold;
        color: ${mainColor};
        margin: 5px 15px;
        font-size: 1.1rem;
      }
      .product-card p {
        margin: 10px 15px 15px;
        color: #666;
        font-size: 0.9rem;
      }
      .product-card .btn {
        margin: 0 15px 15px;
        display: block;
        text-align: center;
      }
      .highlight-section {
        background-color: ${mainColor}15;
        margin: 40px 0;
        padding: 40px 0;
      }
      .highlight-content {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
      }
      .highlight-content h2 {
        margin-bottom: 15px;
        color: ${mainColor};
      }
      .btn-large {
        padding: 12px 30px;
        font-size: 1.1rem;
        margin-top: 20px;
      }
    `;
  } else if (isPortfolio) {
    specificCSS = `
      .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      .portfolio-item {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        height: 250px;
      }
      .portfolio-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      .portfolio-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        color: white;
        padding: 20px;
        transform: translateY(100px);
        transition: transform 0.3s;
      }
      .portfolio-item:hover .portfolio-overlay {
        transform: translateY(0);
      }
      .portfolio-item:hover img {
        transform: scale(1.1);
      }
      .portfolio-overlay h3 {
        margin: 0 0 5px;
      }
      .portfolio-overlay p {
        margin: 0 0 15px;
        opacity: 0.8;
      }
      .btn-sm {
        padding: 5px 15px;
        font-size: 0.8rem;
      }
      .skills-section {
        background-color: #f8f9fa;
      }
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      .skill-item {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      }
      .skill-icon {
        font-size: 2rem;
        margin-bottom: 10px;
      }
      .skill-bar {
        height: 8px;
        background-color: #e9ecef;
        border-radius: 4px;
        margin-top: 10px;
        overflow: hidden;
      }
      .skill-progress {
        height: 100%;
        background-color: ${mainColor};
        border-radius: 4px;
      }
    `;
  } else if (isRestaurante) {
    specificCSS = `
      .menu-section {
        background-color: #f8f9fa;
      }
      .menu-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
      }
      .menu-category {
        padding: 8px 20px;
        background-color: white;
        border: 1px solid #dee2e6;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s;
      }
      .menu-category.active {
        background-color: ${mainColor};
        color: white;
        border-color: ${mainColor};
      }
      .menu-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .menu-item {
        display: flex;
        justify-content: space-between;
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      .menu-item-info {
        flex: 1;
      }
      .menu-item-info h3 {
        margin: 0 0 5px;
      }
      .menu-item-info p {
        margin: 0;
        color: #6c757d;
      }
      .menu-item-price {
        font-weight: bold;
        color: ${mainColor};
        font-size: 1.2rem;
        padding-left: 20px;
      }
      .gallery-section h2 {
        margin-bottom: 30px;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
      }
      .gallery-item {
        border-radius: 8px;
        overflow: hidden;
        height: 200px;
      }
      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      .gallery-item:hover img {
        transform: scale(1.05);
      }
    `;
  } else if (isBlog) {
    specificCSS = `
      .blog-section {
        max-width: 1200px;
        margin: 0 auto;
      }
      .blog-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        margin-top: 30px;
      }
      .blog-post {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .blog-image {
        height: 300px;
        overflow: hidden;
      }
      .blog-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      .blog-post:hover .blog-image img {
        transform: scale(1.03);
      }
      .blog-content {
        padding: 25px;
      }
      .blog-meta {
        display: flex;
        gap: 15px;
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 15px;
      }
      .blog-category {
        color: ${mainColor};
      }
      .blog-content h3 {
        margin: 0 0 15px;
        font-size: 1.5rem;
        line-height: 1.3;
      }
      .blog-content p {
        margin: 0 0 20px;
        color: #495057;
        line-height: 1.6;
      }
      .read-more {
        color: ${mainColor};
        text-decoration: none;
        font-weight: 600;
        display: inline-block;
        position: relative;
      }
      .read-more:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: -3px;
        left: 0;
        background-color: ${mainColor};
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
      }
      .read-more:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
      .blog-pagination {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 40px;
      }
      .pagination-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: white;
        color: #495057;
        text-decoration: none;
        transition: all 0.3s;
      }
      .pagination-item.active {
        background-color: ${mainColor};
        color: white;
      }
      .pagination-item:hover:not(.active) {
        background-color: #e9ecef;
      }
      .pagination-item.next {
        width: auto;
        padding: 0 15px;
        border-radius: 20px;
      }
      @media (min-width: 768px) {
        .blog-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 1024px) {
        .blog-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `;
  } else if (isServico) {
    specificCSS = `
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 30px;
        margin-top: 30px;
      }
      .service-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        padding: 30px;
        transition: transform 0.3s, box-shadow 0.3s;
        text-align: center;
      }
      .service-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.12);
      }
      .service-icon {
        font-size: 3rem;
        margin-bottom: 20px;
      }
      .service-card h3 {
        margin: 0 0 15px;
      }
      .service-card p {
        color: #6c757d;
        margin: 0 0 25px;
      }
      .process-section {
        background-color: #f8f9fa;
      }
      .process-steps {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-top: 30px;
        justify-content: center;
      }
      .process-step {
        flex: 1;
        min-width: 200px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        padding: 25px;
        text-align: center;
        position: relative;
      }
      .step-number {
        width: 50px;
        height: 50px;
        background-color: ${mainColor};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 auto 20px;
      }
      .process-step h3 {
        margin: 0 0 10px;
      }
      .process-step p {
        margin: 0;
        color: #6c757d;
      }
    `;
  }
  
  // Gerar o HTML completo
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: ${fontFamily};
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
          background-color: #fff;
        }
        .header {
          background-color: ${mainColor};
          color: white;
          padding: 80px 20px;
          text-align: center;
          background-image: linear-gradient(135deg, ${mainColor}, ${mainColor}dd);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .section {
          margin: 60px 0;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        h1, h2, h3, h4 {
          font-weight: 700;
          line-height: 1.3;
        }
        h1 {
          font-size: 2.8rem;
          margin-bottom: 15px;
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 25px;
          color: #333;
          position: relative;
          padding-bottom: 15px;
        }
        h2:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background-color: ${mainColor};
        }
        .btn {
          display: inline-block;
          background-color: ${mainColor};
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: ${buttonStyle};
          font-weight: 600;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .btn:hover {
          background-color: ${mainColor}dd;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 40px 20px;
          margin-top: 60px;
        }
        .footer a {
          color: #ddd;
          text-decoration: none;
        }
        .footer a:hover {
          color: white;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
        }
        .social-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255,255,255,0.1);
          border-radius: 50%;
          transition: all 0.3s;
        }
        .social-icon:hover {
          background-color: ${mainColor};
          transform: translateY(-3px);
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          h1 {
            font-size: 2.2rem;
          }
          h2 {
            font-size: 1.6rem;
          }
          .header {
            padding: 60px 20px;
          }
          .section {
            padding: 20px;
            margin: 40px 0;
          }
        }
        
        /* Layout específico baseado no tipo */
        ${specificCSS}
      </style>
    </head>
    <body>
      <div class="header">
        <div class="container">
          <h1>${heroHeadline}</h1>
          <p style="font-size: 1.2rem; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">${heroDescription}</p>
          <a href="#contato" class="btn">${ctaText}</a>
        </div>
      </div>
      
      <div class="container">
        <div class="section">
          <h2>Sobre Nós</h2>
          <p>${aboutText}</p>
        </div>
        
        ${specificContent}
        
        <div id="contato" class="section">
          <h2>Entre em contato</h2>
          <form>
            <div style="margin-bottom: 20px;">
              <label for="nome" style="display: block; margin-bottom: 8px; font-weight: 600;">Nome</label>
              <input type="text" id="nome" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="email" style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
              <input type="email" id="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="mensagem" style="display: block; margin-bottom: 8px; font-weight: 600;">Mensagem</label>
              <textarea id="mensagem" rows="5" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit;"></textarea>
            </div>
            <button type="submit" class="btn" style="border: none; cursor: pointer;">Enviar</button>
          </form>
        </div>
      </div>
      
      <div class="footer">
        <div class="container">
          <div class="social-links">
            <a href="#" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
          <p>&copy; 2025 ${title}. Todos os direitos reservados.</p>
          <p>Criado com <a href="https://promptsites.com.br" target="_blank">PromptSites</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Atualiza o HTML com base em uma mensagem do chat
export const updateHtmlBasedOnMessage = (currentHtml: string, message: string): string => {
  console.log("Atualizando HTML com base na mensagem:", message);
  let newHtml = currentHtml;
  const messageLower = message.toLowerCase();
  let madeChanges = false;

  try {
    // Mudança de cores
    if (messageLower.includes("cor") || messageLower.includes("color") || messageLower.includes("mudar a cor") || messageLower.includes("alterar cor")) {
      console.log("Detectada solicitação de mudança de cor");
      
      const colors = {
        azul: "#1a73e8",
        verde: "#0f9d58",
        vermelho: "#ea4335",
        roxo: "#9c27b0", 
        laranja: "#ff9800",
        rosa: "#e91e63",
        amarelo: "#ffc107",
        preto: "#212121",
        branco: "#ffffff",
        cinza: "#757575"
      };
      
      // Verificar se alguma cor específica foi mencionada
      let foundColor = false;
      for (const [colorName, colorCode] of Object.entries(colors)) {
        if (messageLower.includes(colorName)) {
          console.log(`Mudando cor para ${colorName} (${colorCode})`);
          
          // Substituir cor do header (original e gradiente)
          newHtml = newHtml.replace(
            /background-color: #[0-9a-fA-F]{6};(\s*color: white;|\s*color: #[0-9a-fA-F]{3,6};)?/g, 
            `background-color: ${colorCode};$1`
          );
          
          // Substituir gradiente do cabeçalho
          newHtml = newHtml.replace(
            /background-image: linear-gradient\([^)]+\);/g, 
            `background-image: linear-gradient(135deg, ${colorCode}, ${colorCode}dd);`
          );
          
          // Substituir cor dos botões
          newHtml = newHtml.replace(
            /\.btn\s*{[^}]*background-color: #[0-9a-fA-F]{6};/g, 
            `.btn { display: inline-block; background-color: ${colorCode};`
          );
          
          // Substituir cor do hover dos botões
          newHtml = newHtml.replace(
            /\.btn:hover\s*{[^}]*background-color: #[0-9a-fA-F]{6,8};/g, 
            `.btn:hover { background-color: ${colorCode}dd;`
          );
          
          // Substituir cor da barra após os títulos
          newHtml = newHtml.replace(
            /h2:after[^}]*background-color: #[0-9a-fA-F]{6};/g, 
            `h2:after { content: ''; position: absolute; bottom: 0; left: 0; width: 60px; height: 3px; background-color: ${colorCode};`
          );
          
          // Substituir cores dos elementos de destaque
          newHtml = newHtml.replace(
            /\.social-icon:hover[^}]*background-color: #[0-9a-fA-F]{6};/g, 
            `.social-icon:hover { background-color: ${colorCode};`
          );
          
          // Substituir outras referências à cor principal
          const colorRegex = new RegExp(`color: #[0-9a-fA-F]{6};\\s*[^}]*`, "g");
          if (newHtml.match(colorRegex)) {
            newHtml = newHtml.replace(colorRegex, (match) => {
              if (match.includes("white") || match.includes("#fff") || match.includes("gray") || match.includes("cta") || match.includes("#333") || match.includes("#666")) {
                // Não alterar cores de texto branco, cinza, etc.
                return match;
              }
              return match.replace(/#[0-9a-fA-F]{6}/, colorCode);
            });
          }
          
          foundColor = true;
          madeChanges = true;
          break;
        }
      }
      
      if (!foundColor && messageLower.includes("cor")) {
        // Se o usuário não especificou uma cor conhecida, escolher aleatoriamente
        const colorKeys = Object.keys(colors);
        const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];
        
        console.log(`Cor específica não encontrada. Usando cor aleatória: ${randomColor}`);
        
        // Substituir a cor principal
        newHtml = newHtml.replace(
          /background-color: #[0-9a-fA-F]{6};(\s*color: white;|\s*color: #[0-9a-fA-F]{3,6};)?/g, 
          `background-color: ${randomColor};$1`
        );
        
        // Substituir gradiente do cabeçalho
        newHtml = newHtml.replace(
          /background-image: linear-gradient\([^)]+\);/g, 
          `background-image: linear-gradient(135deg, ${randomColor}, ${randomColor}dd);`
        );
        
        // Substituir cor dos botões
        newHtml = newHtml.replace(
          /\.btn\s*{[^}]*background-color: #[0-9a-fA-F]{6};/g, 
          `.btn { display: inline-block; background-color: ${randomColor};`
        );
        
        madeChanges = true;
      }
    }
    
    // Adicionando depoimentos/testemunhos
    if (messageLower.includes("depoimento") || messageLower.includes("testimonial") || messageLower.includes("avaliação") || messageLower.includes("clientes")) {
      console.log("Adicionando seção de depoimentos");
      
      // Verificar se os depoimentos já existem para evitar duplicação
      if (!newHtml.includes("Depoimentos de Clientes")) {
        const testimonialsSection = `
        <div class="section">
          <h2>Depoimentos de Clientes</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 30px;">
            <div style="flex: 1; min-width: 280px; background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative;">
              <div style="font-size: 2rem; color: #ddd; position: absolute; top: 10px; left: 15px;">"</div>
              <p style="position: relative; z-index: 1; font-style: italic;">"Fiquei impressionado com a qualidade do serviço. Superou todas as minhas expectativas. Recomendo a todos!"</p>
              <div style="margin-top: 20px; display: flex; align-items: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; overflow: hidden; margin-right: 15px;">
                  <img src="https://via.placeholder.com/50x50?text=MS" alt="Cliente" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                  <p style="font-weight: bold; margin: 0;">Maria Silva</p>
                  <p style="margin: 0; font-size: 0.9rem; color: #666;">Cliente desde 2023</p>
                </div>
              </div>
            </div>
            <div style="flex: 1; min-width: 280px; background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative;">
              <div style="font-size: 2rem; color: #ddd; position: absolute; top: 10px; left: 15px;">"</div>
              <p style="position: relative; z-index: 1; font-style: italic;">"Excelente atendimento e produtos de primeira qualidade. Sempre voltarei a comprar aqui!"</p>
              <div style="margin-top: 20px; display: flex; align-items: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; overflow: hidden; margin-right: 15px;">
                  <img src="https://via.placeholder.com/50x50?text=JO" alt="Cliente" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                  <p style="font-weight: bold; margin: 0;">João Oliveira</p>
                  <p style="margin: 0; font-size: 0.9rem; color: #666;">Cliente desde 2022</p>
                </div>
              </div>
            </div>
            <div style="flex: 1; min-width: 280px; background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative;">
              <div style="font-size: 2rem; color: #ddd; position: absolute; top: 10px; left: 15px;">"</div>
              <p style="position: relative; z-index: 1; font-style: italic;">"Superou todas as minhas expectativas. O atendimento é impecável e os produtos são de excelente qualidade."</p>
              <div style="margin-top: 20px; display: flex; align-items: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; overflow: hidden; margin-right: 15px;">
                  <img src="https://via.placeholder.com/50x50?text=AS" alt="Cliente" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                  <p style="font-weight: bold; margin: 0;">Ana Santos</p>
                  <p style="margin: 0; font-size: 0.9rem; color: #666;">Cliente desde 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        
        // Inserir depoimentos antes do formulário de contato
        if (newHtml.includes('<div id="contato" class="section">')) {
          newHtml = newHtml.replace(
            '<div id="contato" class="section">',
            `${testimonialsSection}\n\n        <div id="contato" class="section">`
          );
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do rodapé
          newHtml = newHtml.replace(
            '<div class="footer">',
            `${testimonialsSection}\n\n      <div class="footer">`
          );
          madeChanges = true;
        }
      }
    }
    
    // Adicionando botão de WhatsApp
    if (messageLower.includes("whatsapp") || messageLower.includes("botão de whatsapp") || messageLower.includes("contato whatsapp")) {
      console.log("Adicionando botão de WhatsApp");
      
      // Verificar se o botão já existe para evitar duplicação
      if (!newHtml.includes("wa.me/")) {
        const whatsappButton = `
        <a href="https://wa.me/5511999999999" target="_blank" style="position: fixed; bottom: 20px; right: 20px; background-color: #25D366; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); text-decoration: none; font-size: 30px; z-index: 1000; transition: transform 0.3s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M20.4054 3.5823C18.1716 1.34467 15.1715 0.0988263 12.0405 0.0967083C5.5438 0.0967083 0.251585 5.38766 0.247772 11.8843C0.246652 13.9446 0.825885 15.9533 1.91486 17.703L0.154297 24L6.60115 22.2771C8.28619 23.2685 10.1421 23.7865 12.0341 23.7876H12.0404C18.5363 23.7876 23.8293 18.4959 23.8332 11.9992C23.8353 8.87323 22.6396 5.82017 20.4054 3.5823ZM12.0405 21.7849H12.0353C10.3599 21.7841 8.71491 21.2888 7.28507 20.3619L6.90254 20.1373L2.998 21.1391L4.01902 17.3288L3.77233 16.9319C2.7518 15.4466 2.20056 13.7001 2.2016 11.8853C2.20479 6.49322 6.64959 2.09935 12.0458 2.09935C14.676 2.10094 17.1966 3.1469 19.1103 5.06183C21.024 6.97676 22.0622 9.49849 22.0607 12.1282C22.0572 17.5208 17.6126 21.7849 12.0405 21.7849Z"/>
            <path d="M17.0961 14.3975C16.8139 14.2564 15.4029 13.5698 15.1426 13.4733C14.8824 13.3767 14.693 13.3287 14.5037 13.6107C14.3142 13.8929 13.7685 14.5348 13.6009 14.7242C13.4334 14.9135 13.2659 14.9376 12.9837 14.7965C12.7015 14.6554 11.7852 14.3582 10.7018 13.392C9.85687 12.6347 9.29249 11.6976 9.12501 11.4153C8.95752 11.1331 9.10683 10.979 9.25013 10.8368C9.37992 10.7086 9.53767 10.5018 9.68071 10.3343C9.82374 10.1667 9.87195 10.0462 9.96826 9.85683C10.0646 9.66748 10.0164 9.49993 9.9439 9.35877C9.87195 9.21761 9.31062 7.8062 9.07347 7.24182C8.84391 6.6935 8.61095 6.76782 8.43396 6.76019C8.26647 6.75302 8.07712 6.75174 7.88777 6.75174C7.69842 6.75174 7.38997 6.82376 7.12969 7.10602C6.86947 7.38829 6.13428 8.07487 6.13428 9.48628C6.13428 10.8977 7.15005 12.2644 7.29309 12.4538C7.43612 12.6431 9.28826 15.5251 12.1536 16.7737C12.8418 17.0718 13.3803 17.2567 13.8017 17.3961C14.5014 17.6263 15.1368 17.595 15.6373 17.5217C16.1997 17.4401 17.3356 16.8326 17.5727 16.1729C17.8099 15.5132 17.8099 14.9488 17.738 14.8284C17.6662 14.708 17.4783 14.6385 17.0961 14.3975Z"/>
          </svg>
        </a>
        <style>
          a[href^="https://wa.me/"]:hover {
            transform: scale(1.1);
          }
        </style>
        `;
        
        // Inserir botão de WhatsApp antes da tag de fechamento do body
        newHtml = newHtml.replace(
          /<\/body>/,
          `${whatsappButton}\n    </body>`
        );
        
        madeChanges = true;
      }
    }
    
    // Adicionando galeria de imagens
    if (messageLower.includes("galeria") || messageLower.includes("imagens") || messageLower.includes("fotos")) {
      console.log("Adicionando galeria de imagens");
      
      // Verificar se a galeria já existe para evitar duplicação
      if (!newHtml.includes("Galeria de Imagens") && !newHtml.includes("gallery-grid")) {
        const gallerySection = `
        <div class="section">
          <h2>Galeria de Imagens</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 30px;">
            <div style="overflow: hidden; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); height: 200px; transition: transform 0.3s;">
              <img src="https://via.placeholder.com/500x300?text=Imagem+1" alt="Imagem 1" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
            </div>
            <div style="overflow: hidden; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); height: 200px; transition: transform 0.3s;">
              <img src="https://via.placeholder.com/500x300?text=Imagem+2" alt="Imagem 2" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
            </div>
            <div style="overflow: hidden; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); height: 200px; transition: transform 0.3s;">
              <img src="https://via.placeholder.com/500x300?text=Imagem+3" alt="Imagem 3" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
            </div>
            <div style="overflow: hidden; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); height: 200px; transition: transform 0.3s;">
              <img src="https://via.placeholder.com/500x300?text=Imagem+4" alt="Imagem 4" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
            </div>
          </div>
        </div>
        <style>
          .section div[style*="overflow: hidden; border-radius: 8px"]:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(0,0,0,0.15);
          }
          .section div[style*="overflow: hidden; border-radius: 8px"]:hover img {
            transform: scale(1.05);
          }
        </style>
        `;
        
        // Inserir galeria antes do formulário de contato
        if (newHtml.includes('<div id="contato" class="section">')) {
          newHtml = newHtml.replace(
            '<div id="contato" class="section">',
            `${gallerySection}\n\n        <div id="contato" class="section">`
          );
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do rodapé
          newHtml = newHtml.replace(
            '<div class="footer">',
            `${gallerySection}\n\n      <div class="footer">`
          );
          madeChanges = true;
        }
      }
    }
    
    // Adicionando seção de serviços
    if (messageLower.includes("serviços") || messageLower.includes("services") || messageLower.includes("seção de serviços")) {
      console.log("Adicionando seção de serviços");
      
      // Verificar se a seção de serviços já existe para evitar duplicação
      if (!newHtml.includes("Nossos Serviços") && !newHtml.includes("services-grid")) {
        const servicesSection = `
        <div class="section">
          <h2>Nossos Serviços</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; margin-top: 30px;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;">
              <div style="font-size: 2.5rem; margin-bottom: 20px; color: #333;">⚙️</div>
              <h3 style="margin: 0 0 15px;">Consultoria</h3>
              <p style="margin: 0 0 20px; color: #666;">Oferecemos consultoria especializada para ajudar sua empresa a alcançar melhores resultados e superar desafios.</p>
              <a href="#" class="btn" style="display: inline-block;">Saiba Mais</a>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;">
              <div style="font-size: 2.5rem; margin-bottom: 20px; color: #333;">📊</div>
              <h3 style="margin: 0 0 15px;">Análise de Dados</h3>
              <p style="margin: 0 0 20px; color: #666;">Análise detalhada de dados para informar decisões estratégicas e impulsionar o crescimento do seu negócio.</p>
              <a href="#" class="btn" style="display: inline-block;">Saiba Mais</a>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s;">
              <div style="font-size: 2.5rem; margin-bottom: 20px; color: #333;">🚀</div>
              <h3 style="margin: 0 0 15px;">Marketing Digital</h3>
              <p style="margin: 0 0 20px; color: #666;">Estratégias de marketing digital personalizadas para aumentar sua presença online e atrair mais clientes.</p>
              <a href="#" class="btn" style="display: inline-block;">Saiba Mais</a>
            </div>
          </div>
        </div>
        <style>
          .section div[style*="background-color: white; padding: 30px"]:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          }
        </style>
        `;
        
        // Inserir seção de serviços antes do formulário de contato ou das features existentes
        if (newHtml.includes('<div class="features">')) {
          newHtml = newHtml.replace(
            '<div class="features">',
            `${servicesSection}\n\n        <div class="features">`
          );
          madeChanges = true;
        } else if (newHtml.includes('<div id="contato" class="section">')) {
          newHtml = newHtml.replace(
            '<div id="contato" class="section">',
            `${servicesSection}\n\n        <div id="contato" class="section">`
          );
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do rodapé
          newHtml = newHtml.replace(
            '<div class="footer">',
            `${servicesSection}\n\n      <div class="footer">`
          );
          madeChanges = true;
        }
      }
    }
    
    // Alterando a fonte dos títulos
    if (messageLower.includes("fonte") || messageLower.includes("font") || messageLower.includes("tipografia") || messageLower.includes("letra")) {
      console.log("Alterando a fonte dos títulos");
      
      const fonts = {
        "arial": "Arial, sans-serif",
        "times": "Times New Roman, serif",
        "georgia": "Georgia, serif",
        "verdana": "Verdana, sans-serif",
        "tahoma": "Tahoma, Geneva, sans-serif",
        "courier": "Courier New, monospace",
        "impact": "Impact, Charcoal, sans-serif",
        "comic": "Comic Sans MS, cursive, sans-serif",
        "helvetica": "Helvetica, Arial, sans-serif",
        "lucida": "Lucida Sans Unicode, Lucida Grande, sans-serif",
        "montserrat": "Montserrat, sans-serif",
        "roboto": "Roboto, sans-serif",
        "playfair": "Playfair Display, serif",
        "open sans": "Open Sans, sans-serif",
        "lora": "Lora, serif",
        "merriweather": "Merriweather, serif"
      };
      
      let foundFont = false;
      
      for (const [fontName, fontFamily] of Object.entries(fonts)) {
        if (messageLower.includes(fontName)) {
          console.log(`Mudando fonte para ${fontName} (${fontFamily})`);
          
          // Adicionando regra CSS para títulos
          if (newHtml.includes("</style>")) {
            const styleRule = `
            h1, h2, h3, h4, h5, h6 {
              font-family: ${fontFamily};
            }
            `;
            
            // Inserir a regra no bloco de estilo existente
            newHtml = newHtml.replace(
              /<\/style>/,
              `${styleRule}\n      </style>`
            );
            foundFont = true;
            madeChanges = true;
            break;
          }
        }
      }
      
      // Se a fonte específica não foi encontrada, mas o usuário pediu para mudar
      if (!foundFont && (messageLower.includes("fonte") || messageLower.includes("tipografia"))) {
        // Escolher uma fonte aleatória
        const fontKeys = Object.keys(fonts);
        const randomFont = fonts[fontKeys[Math.floor(Math.random() * fontKeys.length)] as keyof typeof fonts];
        
        console.log(`Fonte específica não encontrada. Usando fonte aleatória: ${randomFont}`);
        
        // Adicionando regra CSS para títulos
        if (newHtml.includes("</style>")) {
          const styleRule = `
          h1, h2, h3, h4, h5, h6 {
            font-family: ${randomFont};
          }
          `;
          
          // Inserir a regra no bloco de estilo existente
          newHtml = newHtml.replace(
            /<\/style>/,
            `${styleRule}\n      </style>`
          );
          madeChanges = true;
        }
      }
    }
    
    // Adicionando animações
    if (messageLower.includes("animação") || messageLower.includes("animacoes") || messageLower.includes("animar") || messageLower.includes("animation")) {
      console.log("Adicionando animações ao site");
      
      // Adicionar animações apenas se não existirem
      if (!newHtml.includes("@keyframes fadeIn") && !newHtml.includes("animation:")) {
        const animationStyles = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .header h1 {
          animation: fadeIn 1s ease-out;
        }
        
        .header p {
          animation: fadeIn 1s ease-out 0.3s backwards;
        }
        
        .header .btn {
          animation: fadeIn 1s ease-out 0.6s backwards;
        }
        
        .section {
          animation: fadeIn 0.8s ease-out;
        }
        
        h2:after {
          animation: slideIn 1s ease-out;
        }
        
        .btn:hover {
          animation: pulse 1s infinite;
        }
        `;
        
        // Inserir estilos de animação
        if (newHtml.includes("</style>")) {
          newHtml = newHtml.replace(
            /<\/style>/,
            `${animationStyles}\n      </style>`
          );
          madeChanges = true;
        }
      }
    }
    
    // Adicionando perguntas frequentes (FAQ)
    if (messageLower.includes("faq") || messageLower.includes("perguntas frequentes") || messageLower.includes("dúvidas")) {
      console.log("Adicionando seção de perguntas frequentes");
      
      // Verificar se a seção FAQ já existe para evitar duplicação
      if (!newHtml.includes("Perguntas Frequentes") && !newHtml.includes("faq-item")) {
        const faqSection = `
        <div class="section">
          <h2>Perguntas Frequentes</h2>
          <div style="margin-top: 30px;">
            <div class="faq-item" style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div class="faq-question" style="padding: 15px 20px; background-color: #f8f9fa; cursor: pointer; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>Como faço para solicitar um orçamento?</span>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-answer" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.3s ease-out;">
                <p style="padding: 15px 0;">Você pode solicitar um orçamento preenchendo o formulário de contato em nosso site ou ligando diretamente para o número (11) 9999-9999.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div class="faq-question" style="padding: 15px 20px; background-color: #f8f9fa; cursor: pointer; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>Qual o prazo de entrega para os produtos/serviços?</span>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-answer" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.3s ease-out;">
                <p style="padding: 15px 0;">O prazo de entrega varia de acordo com o tipo de produto/serviço solicitado. Geralmente, nossos prazos variam de 5 a 15 dias úteis.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div class="faq-question" style="padding: 15px 20px; background-color: #f8f9fa; cursor: pointer; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>Vocês oferecem garantia?</span>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-answer" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.3s ease-out;">
                <p style="padding: 15px 0;">Sim, todos os nossos produtos e serviços possuem garantia. O período de garantia varia de acordo com o tipo de produto/serviço, mas geralmente é de 90 dias.</p>
              </div>
            </div>
            
            <div class="faq-item" style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div class="faq-question" style="padding: 15px 20px; background-color: #f8f9fa; cursor: pointer; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>Quais formas de pagamento vocês aceitam?</span>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-answer" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.3s ease-out;">
                <p style="padding: 15px 0;">Aceitamos diversas formas de pagamento, incluindo cartões de crédito e débito, transferência bancária, PIX e boleto bancário.</p>
              </div>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const faqQuestions = document.querySelectorAll('.faq-question');
              
              faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                  const answer = this.nextElementSibling;
                  const icon = this.querySelector('.faq-icon');
                  
                  if (answer.style.maxHeight === '0px' || answer.style.maxHeight === '') {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.textContent = '-';
                  } else {
                    answer.style.maxHeight = '0px';
                    icon.textContent = '+';
                  }
                });
              });
            });
          </script>
        </div>
        `;
        
        // Inserir seção de FAQ antes do formulário de contato
        if (newHtml.includes('<div id="contato" class="section">')) {
          newHtml = newHtml.replace(
            '<div id="contato" class="section">',
            `${faqSection}\n\n        <div id="contato" class="section">`
          );
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do rodapé
          newHtml = newHtml.replace(
            '<div class="footer">',
            `${faqSection}\n\n      <div class="footer">`
          );
          madeChanges = true;
        }
      }
    }
    
    // Adicionando um banner de destaque
    if (messageLower.includes("banner") || messageLower.includes("destaque") || messageLower.includes("promoção") || messageLower.includes("promocao")) {
      console.log("Adicionando banner de destaque");
      
      // Verificar se já existe um banner para evitar duplicação
      if (!newHtml.includes("banner-section") && !newHtml.includes("banner-content")) {
        // Extrair a cor principal do site
        let mainColor = "#1a73e8";
        const colorMatch = newHtml.match(/background-color: (#[0-9a-fA-F]{6});.*color: white;/);
        if (colorMatch && colorMatch[1]) {
          mainColor = colorMatch[1];
        }
        
        const bannerSection = `
        <div class="section banner-section" style="padding: 0; overflow: hidden; position: relative; margin: 60px 0;">
          <div style="background: linear-gradient(135deg, ${mainColor}, ${mainColor}99); padding: 50px 20px; color: white; position: relative; z-index: 1;">
            <div class="container">
              <div class="banner-content" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 30px;">
                <div style="flex: 1; min-width: 300px;">
                  <h2 style="color: white; margin-top: 0; font-size: 2rem;">Oferta Especial por Tempo Limitado</h2>
                  <p style="font-size: 1.1rem; margin-bottom: 25px;">Aproveite descontos exclusivos nos nossos produtos e serviços. Entre em contato agora mesmo para saber mais!</p>
                  <a href="#contato" class="btn" style="background-color: white; color: ${mainColor}; border: none;">Saiba Mais</a>
                </div>
                <div style="flex: 1; min-width: 300px; text-align: center;">
                  <div style="font-size: 4rem; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">20% OFF</div>
                  <div style="font-size: 1.2rem; margin-top: 10px;">Use o código: <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 4px; font-weight: bold;">PROMO20</span></div>
                </div>
              </div>
            </div>
          </div>
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; opacity: 0.05;">
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: repeating-linear-gradient(45deg, #fff, #fff 10px, #f8f8f8 10px, #f8f8f8 20px);"></div>
          </div>
        </div>
        `;
        
        // Inserir o banner após a primeira seção
        const firstSectionEnd = newHtml.indexOf('</div>', newHtml.indexOf('<div class="section">')) + 6;
        if (firstSectionEnd > 6) {
          const beforeBanner = newHtml.substring(0, firstSectionEnd);
          const afterBanner = newHtml.substring(firstSectionEnd);
          newHtml = beforeBanner + '\n\n        ' + bannerSection + afterBanner;
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do formulário de contato
          if (newHtml.includes('<div id="contato" class="section">')) {
            newHtml = newHtml.replace(
              '<div id="contato" class="section">',
              `${bannerSection}\n\n        <div id="contato" class="section">`
            );
            madeChanges = true;
          }
        }
      }
    }
    
    // Adicionando um mapa de localização
    if (messageLower.includes("mapa") || messageLower.includes("localização") || messageLower.includes("localizacao") || messageLower.includes("endereco") || messageLower.includes("endereço")) {
      console.log("Adicionando mapa de localização");
      
      // Verificar se já existe um mapa para evitar duplicação
      if (!newHtml.includes("iframe") && !newHtml.includes("maps.google.com")) {
        const mapSection = `
        <div class="section">
          <h2>Nossa Localização</h2>
          <div style="margin-top: 30px;">
            <div style="display: flex; flex-wrap: wrap; gap: 30px;">
              <div style="flex: 1; min-width: 300px;">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976551562564!2d-46.65390508502168!3d-23.564719184683067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr" width="100%" height="350" style="border:0; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <div style="flex: 1; min-width: 300px;">
                <h3 style="margin-top: 0;">Endereço</h3>
                <p style="margin-bottom: 20px;">Av. Paulista, 1000<br>Bela Vista, São Paulo - SP<br>CEP: 01310-100</p>
                
                <h3>Horário de Funcionamento</h3>
                <p style="margin-bottom: 20px;">Segunda a Sexta: 9h às 18h<br>Sábado: 9h às 13h<br>Domingo: Fechado</p>
                
                <h3>Contato</h3>
                <p>Telefone: (11) 9999-9999<br>Email: contato@seudominio.com.br</p>
              </div>
            </div>
          </div>
        </div>
        `;
        
        // Inserir o mapa antes do formulário de contato
        if (newHtml.includes('<div id="contato" class="section">')) {
          newHtml = newHtml.replace(
            '<div id="contato" class="section">',
            `${mapSection}\n\n        <div id="contato" class="section">`
          );
          madeChanges = true;
        } else {
          // Alternativa: inserir antes do rodapé
          newHtml = newHtml.replace(
            '<div class="footer">',
            `${mapSection}\n\n      <div class="footer">`
          );
          madeChanges = true;
        }
      }
    }
  } catch (error) {
    console.error("Erro ao processar a atualização HTML:", error);
  }
  
  // Verificar se foram feitas alterações
  if (!madeChanges) {
    console.log("Nenhuma alteração foi feita no HTML com base na mensagem do usuário");
  } else {
    console.log("HTML atualizado com sucesso!");
  }
  
  // Retorna o HTML atualizado
  return newHtml;
};

export const getTemplateSuggestions = (siteName: string): string[] => {
  const suggestions = [
    "Adicione um formulário de contato",
    "Insira uma galeria de imagens",
    "Crie uma seção de perguntas frequentes",
    "Adicione um mapa de localização",
    "Coloque ícones de redes sociais",
    "Adicione um contador de tempo para ofertas",
    "Insira um banner de promoção",
    "Crie uma animação de entrada na página",
  ];
  
  if (siteName.toLowerCase().includes("loja")) {
    return [
      "Adicione uma vitrine de produtos em destaque",
      "Crie uma seção de categorias de produtos",
      "Insira badges de formas de pagamento",
      "Adicione um banner de frete grátis",
      "Mude a cor do site para azul",
      "Adicione um botão de WhatsApp",
      ...suggestions
    ];
  }
  
  if (siteName.toLowerCase().includes("portfolio") || siteName.toLowerCase().includes("portfólio")) {
    return [
      "Adicione uma seção de trabalhos recentes",
      "Insira um currículo interativo",
      "Crie uma linha do tempo com sua experiência",
      "Adicione depoimentos de clientes satisfeitos",
      "Mude a fonte para uma mais moderna",
      "Adicione animações nas imagens",
      ...suggestions
    ];
  }
  
  if (siteName.toLowerCase().includes("restaurante") || siteName.toLowerCase().includes("comida")) {
    return [
      "Adicione um cardápio interativo",
      "Insira fotos dos pratos principais",
      "Crie uma seção de reservas online",
      "Adicione informações sobre delivery",
      "Mude a cor do site para um tom mais quente",
      "Adicione um mapa com a localização",
      ...suggestions
    ];
  }
  
  if (siteName.toLowerCase().includes("blog") || siteName.toLowerCase().includes("notícia")) {
    return [
      "Adicione uma seção de artigos em destaque",
      "Insira uma barra de busca",
      "Crie categorias para os artigos",
      "Adicione uma lista de tags populares",
      "Mude a fonte para melhorar a leitura",
      "Adicione botões de compartilhamento",
      ...suggestions
    ];
  }
  
  return suggestions;
};

// Define os temas disponíveis para seleção
export const getAvailableThemes = () => {
  return [
    {
      id: 'minimal',
      name: 'Minimalista',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Minimalista',
      description: 'Design limpo e moderno para destacar seu conteúdo.',
      styles: {
        mainColor: '#3f51b5',
        fontFamily: 'Montserrat, sans-serif',
        buttonStyle: 'rounded',
        layoutType: 'default'
      }
    },
    {
      id: 'business',
      name: 'Empresarial',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Empresarial',
      description: 'Design profissional ideal para empresas e negócios.',
      styles: {
        mainColor: '#1a73e8',
        fontFamily: 'Open Sans, sans-serif',
        buttonStyle: 'rounded-md',
        layoutType: 'feature'
      }
    },
    {
      id: 'creative',
      name: 'Criativo',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Criativo',
      description: 'Layout arrojado e colorido para projetos criativos e artísticos.',
      styles: {
        mainColor: '#9c27b0',
        fontFamily: 'Playfair Display, serif',
        buttonStyle: 'rounded-full',
        layoutType: 'masonry'
      }
    },
    {
      id: 'ecommerce',
      name: 'Loja Virtual',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Loja',
      description: 'Estrutura completa para apresentar produtos e catálogos.',
      styles: {
        mainColor: '#43a047',
        fontFamily: 'Montserrat, sans-serif',
        buttonStyle: 'rounded-lg',
        layoutType: 'grid'
      }
    },
    {
      id: 'portfolio',
      name: 'Portfólio',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Portfólio',
      description: 'Ideal para fotógrafos, designers e artistas mostrarem seus trabalhos.',
      styles: {
        mainColor: '#ff5722',
        fontFamily: 'Playfair Display, serif',
        buttonStyle: 'rounded',
        layoutType: 'masonry'
      }
    },
    {
      id: 'restaurant',
      name: 'Restaurante',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Restaurante',
      description: 'Perfeito para restaurantes e serviços de alimentação.',
      styles: {
        mainColor: '#ff9800',
        fontFamily: 'Lora, serif',
        buttonStyle: 'rounded-lg',
        layoutType: 'card'
      }
    },
    {
      id: 'blog',
      name: 'Blog',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Blog',
      description: 'Layout otimizado para publicação de conteúdo e artigos.',
      styles: {
        mainColor: '#0f9d58',
        fontFamily: 'Merriweather, serif',
        buttonStyle: 'rounded',
        layoutType: 'list'
      }
    },
    {
      id: 'events',
      name: 'Eventos',
      thumbnail: 'https://via.placeholder.com/300x200?text=Tema+Eventos',
      description: 'Ideal para conferências, workshops e eventos especiais.',
      styles: {
        mainColor: '#e91e63',
        fontFamily: 'Montserrat, sans-serif',
        buttonStyle: 'rounded-full',
        layoutType: 'card'
      }
    }
  ];
};
