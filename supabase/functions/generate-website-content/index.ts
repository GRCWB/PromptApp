
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, type, useAdvancedModel = false } = await req.json()

    if (!prompt || !type) {
      throw new Error("Prompt e tipo são obrigatórios")
    }

    console.log(`Gerando conteúdo de tipo ${type} para prompt: ${prompt} (usando modelo avançado: ${useAdvancedModel})`)
    
    // Extract keywords from the prompt for better context
    const keywords = extractKeywords(prompt)
    console.log("Palavras-chave extraídas:", keywords)
    
    // Detect the business/project type from the prompt
    const businessType = detectBusinessType(prompt)
    console.log("Tipo de negócio detectado:", businessType)

    // Define system prompts tailored for each content type
    const systemPrompts = {
      siteName: "Você é um especialista em criar nomes de sites e marcas. Crie um nome curto, memorável e relevante para o negócio descrito, considerando o nicho de mercado. Seja criativo e não use nomes genéricos. Responda APENAS com o nome, sem explicações adicionais.",
      heroSection: "Você é um copywriter especializado em criar textos impactantes para seções hero de sites. Crie um título atraente e uma descrição concisa que capture a essência do negócio descrito e atraia a atenção do visitante. Formato: JSON com 'headline' (título atrativo) e 'description' (descrição persuasiva).",
      about: "Você é um redator especializado em criar histórias de marca. Escreva um texto persuasivo para a seção 'Sobre Nós' do site, destacando diferenciais únicos do negócio descrito, valores e missão. Seja específico ao nicho de mercado mencionado. Responda apenas com o texto.",
      cta: "Você é um especialista em conversão e UX. Crie 3 diferentes textos para botões de call-to-action que incentivem a ação e sejam específicos para o tipo de negócio descrito. Considere a jornada do cliente e o que seria mais atrativo para o público-alvo. Responda em formato de array JSON com 3 strings imperativas."
    }

    // Use OpenAI API if key is available
    let content
    try {
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
      
      if (!openAIApiKey) {
        console.log("API key da OpenAI não configurada, usando geração alternativa")
        throw new Error("API key da OpenAI não configurada")
      }

      // Prepare context-rich prompt with keywords and business type
      const enhancedPrompt = `
        Descrição do negócio/projeto: ${prompt}
        
        Tipo de negócio/projeto identificado: ${businessType}
        Palavras-chave relevantes: ${keywords.join(', ')}
        
        Baseado nas informações acima, gere conteúdo único e personalizado para a seção "${type}" do site.
      `
      
      // Select model based on flag
      const model = useAdvancedModel ? 'gpt-4o' : 'gpt-4o-mini'
      console.log(`Usando modelo OpenAI: ${model}`)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { 
              role: 'system', 
              content: systemPrompts[type] || "Você é um especialista em conteúdo para websites."
            },
            { 
              role: 'user', 
              content: enhancedPrompt
            }
          ],
          temperature: 0.8, // Higher temperature for more creative outputs
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro da API OpenAI:", errorData)
        throw new Error(`Erro da API OpenAI: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      if (data?.choices?.[0]?.message?.content) {
        content = data.choices[0].message.content.trim()
        console.log(`Resposta da OpenAI para ${type}:`, content)
        
        // Parse JSON response if needed
        if (type === 'heroSection' || type === 'cta') {
          try {
            content = JSON.parse(content)
          } catch (parseError) {
            console.error("Erro ao analisar resposta JSON:", parseError)
            // If parsing fails, handle each type differently
            if (type === 'heroSection') {
              content = {
                headline: content.split('\n')[0] || "Bem-vindo",
                description: content.split('\n').slice(1).join(' ') || "Descrição do site"
              }
            } else if (type === 'cta') {
              // Extract potential CTA phrases from text
              const phrases = content.split(/[.,;]/).filter(p => p.trim().length > 0)
              content = phrases.length >= 3 ? phrases.slice(0, 3) : generateCTAs(businessType)
            }
          }
        }
      } else {
        console.error("Resposta da OpenAI sem conteúdo válido:", data)
        throw new Error("OpenAI não retornou conteúdo válido")
      }
    } catch (openAIError) {
      console.error("Erro ao chamar OpenAI:", openAIError)
      
      // Fallback to alternative generation if OpenAI fails
      console.log("Usando geração de conteúdo alternativa")
      switch (type) {
        case 'siteName':
          content = generateSiteName(businessType, keywords)
          break
        case 'heroSection':
          content = generateHeroSection(businessType, keywords)
          break
        case 'about':
          content = generateAboutText(businessType, keywords)
          break
        case 'cta':
          content = generateCTAs(businessType)
          break
        default:
          content = "Conteúdo do site"
      }
    }

    console.log(`Conteúdo final gerado para ${type}:`, content)
    
    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Erro geral na função:', error)
    
    // Generate fallback data based on the requested type
    const fallbackData = generateFallbackData()
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true,
      data: fallbackData
    }), {
      status: 200, // Return 200 even for errors, but with fallback content
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// ----- Helper Functions -----

function extractKeywords(prompt: string): string[] {
  // Lista de palavras-chave comuns a serem ignoradas
  const stopWords = new Set(['um', 'uma', 'o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'para', 'com', 'em', 'por', 'que', 'se', 'na', 'no', 'e', 'ou'])
  
  // Extrair palavras, remover stopwords e manter apenas palavras relevantes
  const words = prompt.toLowerCase()
    .replace(/[^\w\sáàâãéèêíïóôõöúüç]/g, '')
    .split(/\s+/)
    .filter(word => !stopWords.has(word) && word.length > 3)
  
  // Remover duplicatas e limitar a 15 palavras-chave para maior contexto
  return [...new Set(words)].slice(0, 15)
}

function detectBusinessType(prompt: string): string {
  const promptLower = prompt.toLowerCase()
  
  // Mapeamento expandido de tipos de negócios com palavras-chave relacionadas
  const businessTypes = {
    loja: ['loja', 'produto', 'venda', 'compra', 'e-commerce', 'comércio', 'virtual', 'lojista', 'marketplace', 'varejo', 'atacado', 'shopping'],
    restaurante: ['restaurante', 'comida', 'gastronomia', 'culinária', 'refeição', 'cardápio', 'menu', 'chef', 'cozinha', 'bar', 'café', 'pizzaria', 'hamburguer'],
    portfolio: ['portfólio', 'portfolio', 'trabalho', 'projeto', 'criativo', 'design', 'fotografia', 'arte', 'artista', 'freelancer', 'designer'],
    blog: ['blog', 'notícia', 'artigo', 'conteúdo', 'post', 'publicação', 'revista', 'editorial', 'revista', 'mídia'],
    servico: ['serviço', 'consultoria', 'assessoria', 'profissional', 'especialista', 'freelance', 'prestador', 'assistência'],
    saude: ['saúde', 'médico', 'clínica', 'hospital', 'paciente', 'tratamento', 'consulta', 'bem-estar', 'terapia', 'medicina', 'dentista', 'psicólogo'],
    educacao: ['educação', 'escola', 'curso', 'aula', 'professor', 'aluno', 'ensino', 'treinamento', 'coaching', 'universidade', 'faculdade', 'academia'],
    tecnologia: ['tecnologia', 'software', 'aplicativo', 'sistema', 'desenvolvimento', 'programação', 'digital', 'startup', 'inovação', 'tech', 'app', 'site', 'web'],
    imobiliaria: ['imobiliária', 'imóvel', 'casa', 'apartamento', 'aluguel', 'compra', 'venda', 'corretor', 'empreendimento', 'condomínio'],
    fitness: ['fitness', 'academia', 'treino', 'exercício', 'saúde', 'bem-estar', 'personal', 'esporte', 'musculação'],
    beleza: ['beleza', 'estética', 'salão', 'maquiagem', 'cabelo', 'cosméticos', 'spa', 'tratamento'],
    turismo: ['turismo', 'viagem', 'hotel', 'pousada', 'resort', 'pacote', 'férias', 'destino', 'agência'],
    evento: ['evento', 'festa', 'casamento', 'aniversário', 'conferência', 'workshop', 'organizador'],
    ong: ['ong', 'organização', 'sem fins lucrativos', 'caridade', 'doação', 'voluntário', 'social', 'impacto']
  }
  
  // Verificar qual tipo tem mais palavras-chave presentes no prompt
  let matchedType = 'generic'
  let maxMatches = 0
  
  for (const [type, keywords] of Object.entries(businessTypes)) {
    const matches = keywords.filter(keyword => promptLower.includes(keyword)).length
    if (matches > maxMatches) {
      maxMatches = matches
      matchedType = type
    }
  }
  
  return matchedType
}

function generateSiteName(businessType: string, keywords: string[]): string {
  // Alguns prefixos e sufixos comuns para nomes de sites
  const prefixes = ['Web', 'Digital', 'Smart', 'Pro', 'Easy', 'Best', 'Top', 'Prime', 'Elite', 'Mega', 'Ultra', 'Next', 'Nova']
  const suffixes = ['Hub', 'Space', 'Site', 'Web', 'Online', 'Plus', 'Brasil', 'Store', 'Shop', 'Express', 'Place', 'World', 'Center']
  
  // Selecionar até duas palavras-chave relevantes
  const keyword1 = keywords.length > 0 ? keywords[Math.floor(Math.random() * Math.min(3, keywords.length))] : ''
  const keyword2 = keywords.length > 1 ? keywords[Math.floor(Math.random() * Math.min(3, keywords.length))] : ''
  
  // Capitalize a primeira letra
  const keywordCapitalized = keyword1 ? keyword1.charAt(0).toUpperCase() + keyword1.slice(1) : ''
  
  // Gerar nome com base no tipo de negócio
  switch (businessType) {
    case 'loja':
      return keyword1 ? `${keywordCapitalized}Store` : `${prefixes[Math.floor(Math.random() * prefixes.length)]}Shopping`
    case 'restaurante':
      return keyword1 ? `${keywordCapitalized}Gourmet` : 'SaborExpress'
    case 'portfolio':
      return keyword1 ? `${keywordCapitalized}Works` : 'CreativePortfolio'
    case 'blog':
      return keyword1 ? `${keywordCapitalized}Blog` : 'ContentHub'
    case 'servico':
      return keyword1 ? `${keywordCapitalized}Pro` : 'ExpertServices'
    case 'saude':
      return keyword1 ? `${keywordCapitalized}Clinic` : 'VidaSaúde'
    case 'educacao':
      return keyword1 ? `${keywordCapitalized}Learn` : 'EduSmart'
    case 'tecnologia':
      return keyword1 ? `${keywordCapitalized}Tech` : 'InnovaTech'
    case 'imobiliaria':
      return keyword1 ? `${keywordCapitalized}Imóveis` : 'ImoBest'
    case 'fitness':
      return keyword1 ? `${keywordCapitalized}Fit` : 'TopFitness'
    case 'beleza':
      return keyword1 ? `${keywordCapitalized}Beauty` : 'BeautySpace'
    case 'turismo':
      return keyword1 ? `${keywordCapitalized}Travel` : 'TravelWorld'
    case 'evento':
      return keyword1 ? `${keywordCapitalized}Events` : 'EventoPro'
    case 'ong':
      return keyword1 ? `${keywordCapitalized}Care` : 'SocialImpact'
    default:
      // Caso genérico com combinações mais variadas
      if (keyword1 && keyword2) {
        // Combine two keywords
        return `${keywordCapitalized}${keyword2.charAt(0).toUpperCase() + keyword2.slice(1)}`
      } else if (keyword1) {
        // Use one keyword with a suffix
        return `${keywordCapitalized}${suffixes[Math.floor(Math.random() * suffixes.length)]}`
      } else {
        // Completely random combination
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        return `${prefix}${suffix}`
      }
  }
}

function generateHeroSection(businessType: string, keywords: string[]): {headline: string, description: string} {
  // Extrair palavras-chave para personalização
  const keyword = keywords.length > 0 ? keywords[0] : ''
  
  // Gerar título e descrição com base no tipo de negócio
  switch (businessType) {
    case 'loja':
      return {
        headline: keyword ? `Encontre os melhores ${keyword} aqui` : `Produtos exclusivos para seu estilo`,
        description: `Qualidade garantida e preços competitivos. Sua experiência de compra como você merece.`
      }
    case 'restaurante':
      return {
        headline: keyword ? `Experimente nosso ${keyword} especial` : `Sabores únicos em cada momento`,
        description: `Uma experiência gastronômica inesquecível com ingredientes selecionados e receitas exclusivas.`
      }
    case 'portfolio':
      return {
        headline: keyword ? `Projetos criativos de ${keyword}` : `Design que inspira e transforma`,
        description: `Criatividade e excelência técnica em cada projeto. Resultados que superam expectativas.`
      }
    case 'blog':
      return {
        headline: keyword ? `Tudo sobre ${keyword} em um só lugar` : `Conteúdo que transforma ideias`,
        description: `Artigos relevantes e atualizados sobre os temas que realmente importam para você.`
      }
    case 'servico':
      return {
        headline: keyword ? `Serviços especializados em ${keyword}` : `Soluções personalizadas para seu negócio`,
        description: `Profissionais qualificados prontos para atender suas necessidades com eficiência e qualidade.`
      }
    case 'saude':
      return {
        headline: keyword ? `Cuidados especializados em ${keyword}` : `Saúde e bem-estar em primeiro lugar`,
        description: `Atendimento humanizado e tratamentos modernos para garantir sua qualidade de vida.`
      }
    case 'educacao':
      return {
        headline: keyword ? `Aprenda ${keyword} com especialistas` : `Conhecimento que transforma futuros`,
        description: `Métodos inovadores e professores qualificados para impulsionar seu desenvolvimento.`
      }
    case 'tecnologia':
      return {
        headline: keyword ? `Soluções em ${keyword} para seu negócio` : `Inovação tecnológica ao seu alcance`,
        description: `Desenvolvimento de soluções digitais que otimizam processos e ampliam resultados.`
      }
    case 'imobiliaria':
      return {
        headline: keyword ? `Os melhores ${keyword} para você` : `Encontre o imóvel dos seus sonhos`,
        description: `Assessoria completa na compra, venda e locação de imóveis com as melhores oportunidades.`
      }
    case 'fitness':
      return {
        headline: keyword ? `Transforme seu corpo com ${keyword}` : `Resultados reais para sua saúde`,
        description: `Programas de treinamento personalizados para atingir seus objetivos fitness.`
      }
    case 'beleza':
      return {
        headline: keyword ? `Realce sua beleza com ${keyword}` : `Beleza que realça sua essência`,
        description: `Tratamentos estéticos inovadores e produtos de qualidade para valorizar sua aparência.`
      }
    case 'turismo':
      return {
        headline: keyword ? `Descubra ${keyword} com quem entende` : `Viagens inesquecíveis, momentos eternos`,
        description: `Roteiros exclusivos e atendimento personalizado para tornar sua viagem perfeita.`
      }
    case 'evento':
      return {
        headline: keyword ? `${keyword} memoráveis para todos os momentos` : `Eventos que ficam na memória`,
        description: `Planejamento completo e execução impecável para garantir o sucesso do seu evento.`
      }
    case 'ong':
      return {
        headline: keyword ? `Transformando vidas através de ${keyword}` : `Juntos por um mundo melhor`,
        description: `Projetos sociais com impacto real nas comunidades e no meio ambiente.`
      }
    default:
      return {
        headline: keyword ? `Soluções inovadoras em ${keyword}` : `Inovação e qualidade para você`,
        description: `Transforme suas ideias em realidade com nossa experiência e comprometimento.`
      }
  }
}

function generateAboutText(businessType: string, keywords: string[]): string {
  // Extrair palavras-chave para personalização
  const keyword1 = keywords.length > 0 ? keywords[0] : ''
  const keyword2 = keywords.length > 1 ? keywords[1] : ''
  
  // Gerar texto "Sobre" com base no tipo de negócio
  switch (businessType) {
    case 'loja':
      return `Nossa loja foi fundada com o objetivo de oferecer ${keyword1 || 'produtos'} de alta qualidade a preços justos. Trabalhamos com as melhores marcas e priorizamos a satisfação dos nossos clientes em todas as etapas da compra, desde a navegação no site até o pós-venda.`
    case 'restaurante':
      return `Nosso restaurante nasceu da paixão por ${keyword1 || 'gastronomia'} e do desejo de proporcionar uma experiência culinária memorável. Com ingredientes selecionados e receitas exclusivas, criamos pratos que encantam os paladares mais exigentes em um ambiente acolhedor e sofisticado.`
    case 'portfolio':
      return `Sou um profissional especializado em ${keyword1 || 'design'} com vasta experiência em ${keyword2 || 'projetos criativos'}. Meu trabalho é focado em entender as necessidades de cada cliente para entregar soluções personalizadas e inovadoras que superam expectativas e geram resultados tangíveis.`
    case 'blog':
      return `Este blog nasceu da vontade de compartilhar conhecimento sobre ${keyword1 || 'temas relevantes'} de forma acessível e aprofundada. Nosso time de especialistas trabalha para trazer conteúdos atualizados, análises críticas e dicas práticas que realmente fazem diferença no dia a dia dos nossos leitores.`
    case 'servico':
      return `Nossa empresa é especializada em serviços de ${keyword1 || 'consultoria'} com foco em resultados. Contamos com profissionais altamente qualificados e metodologias comprovadas para ajudar nossos clientes a superarem desafios, otimizarem processos e alcançarem seus objetivos de negócio.`
    case 'saude':
      return `Nossa clínica é referência em tratamentos de ${keyword1 || 'saúde'} com abordagem humanizada e tecnologia de ponta. Nossa equipe multidisciplinar trabalha de forma integrada para oferecer diagnósticos precisos e tratamentos eficazes, sempre priorizando o bem-estar e a qualidade de vida dos pacientes.`
    case 'educacao':
      return `Somos uma instituição educacional comprometida com a excelência no ensino de ${keyword1 || 'conhecimentos essenciais'}. Nossa metodologia inovadora combina teoria e prática, preparando os alunos para os desafios reais do mercado com professores experientes e infraestrutura completa.`
    case 'tecnologia':
      return `Nossa empresa desenvolve soluções tecnológicas em ${keyword1 || 'sistemas'} que impulsionam a transformação digital dos negócios. Com expertise em ${keyword2 || 'desenvolvimento de software'} e inovação constante, ajudamos empresas de todos os tamanhos a otimizarem processos e aumentarem sua competitividade.`
    case 'imobiliaria':
      return `Somos especialistas no mercado imobiliário, com foco em ${keyword1 || 'imóveis'} que atendem às necessidades dos nossos clientes. Nossa equipe oferece assessoria completa em todas as etapas da negociação, garantindo segurança jurídica e as melhores condições comerciais.`
    case 'fitness':
      return `Nosso centro fitness é dedicado a transformar vidas através de ${keyword1 || 'treinamentos'} personalizados e acompanhamento profissional. Combinamos equipamentos modernos, metodologias científicas e motivação constante para ajudar nossos alunos a conquistarem seus objetivos de forma saudável e sustentável.`
    case 'beleza':
      return `Nosso espaço de beleza foi criado para realçar a beleza natural de cada cliente através de ${keyword1 || 'tratamentos'} exclusivos. Utilizamos produtos de alta qualidade e técnicas inovadoras aplicadas por profissionais experientes que se mantêm atualizados com as últimas tendências do mercado.`
    case 'turismo':
      return `Nossa agência de turismo é especializada em criar experiências inesquecíveis em ${keyword1 || 'destinos'} nacionais e internacionais. Elaboramos roteiros personalizados que combinam conforto, segurança e momentos únicos, cuidando de cada detalhe para que você aproveite ao máximo sua viagem.`
    case 'evento':
      return `Somos referência na organização de ${keyword1 || 'eventos'} com planejamento detalhado e execução impecável. Nossa equipe cuida de cada aspecto, desde a concepção criativa até a logística completa, garantindo experiências memoráveis para todos os participantes e resultados que superam expectativas.`
    case 'ong':
      return `Nossa organização atua no desenvolvimento de projetos sociais focados em ${keyword1 || 'causas importantes'} com impacto mensurável nas comunidades. Trabalhamos com transparência, eficiência e compromisso para transformar realidades e construir um futuro mais justo e sustentável para todos.`
    default:
      return `Somos uma empresa dedicada a oferecer soluções inovadoras que atendem às necessidades específicas dos nossos clientes. Com anos de experiência e uma equipe altamente qualificada, nosso compromisso é entregar qualidade e excelência em tudo o que fazemos, construindo relacionamentos duradouros baseados em confiança e resultados.`
  }
}

function generateCTAs(businessType: string): string[] {
  // Gerar CTAs com base no tipo de negócio
  switch (businessType) {
    case 'loja':
      return ['Explorar produtos', 'Ver ofertas especiais', 'Comprar agora']
    case 'restaurante':
      return ['Ver cardápio completo', 'Fazer reserva', 'Pedir delivery']
    case 'portfolio':
      return ['Explorar projetos', 'Solicitar orçamento', 'Agendar reunião']
    case 'blog':
      return ['Ler artigos recentes', 'Assinar newsletter', 'Participar da comunidade']
    case 'servico':
      return ['Conhecer serviços', 'Solicitar proposta', 'Agendar consultoria']
    case 'saude':
      return ['Marcar consulta', 'Conhecer especialidades', 'Agendar avaliação']
    case 'educacao':
      return ['Conhecer cursos', 'Agendar visita', 'Fazer matrícula']
    case 'tecnologia':
      return ['Solicitar demonstração', 'Conhecer soluções', 'Iniciar projeto']
    case 'imobiliaria':
      return ['Ver imóveis disponíveis', 'Agendar visita', 'Falar com corretor']
    case 'fitness':
      return ['Iniciar avaliação', 'Conhecer planos', 'Agendar aula experimental']
    case 'beleza':
      return ['Agendar horário', 'Ver tratamentos', 'Conhecer produtos']
    case 'turismo':
      return ['Explorar destinos', 'Solicitar orçamento', 'Planejar viagem']
    case 'evento':
      return ['Solicitar orçamento', 'Conhecer espaços', 'Agendar visita']
    case 'ong':
      return ['Fazer doação', 'Ser voluntário', 'Conhecer projetos']
    default:
      return ['Saiba mais', 'Entre em contato', 'Solicitar informações']
  }
}

function generateFallbackData() {
  return {
    siteName: "Meu Site",
    heroSection: {
      headline: "Bem-vindo ao nosso site",
      description: "Um site incrível criado para você"
    },
    about: "Nosso negócio está comprometido em oferecer os melhores produtos e serviços para nossos clientes.",
    cta: ["Entre em contato", "Saiba mais", "Conheça nossos serviços"]
  }
}
