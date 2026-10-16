/**
 * Brazilian Portuguese. Only the dashboard is translated so far: every other
 * key falls back to English until the rest of the app is translated.
 */
export const portugueseCrmMessages = {
  resources: {
    deals: {
      card: {
        age_short: "%{days} d",
        age_title: "Sem contato há %{days} dias · última interação: %{date}",
      },
      view: {
        label: "Visualização",
        board: "Quadro",
        focus: "Foco",
        show_details: "Mostrar detalhes",
      },
      sort: {
        label: "Organizar cards",
        manual: "Minha ordem (arrastar)",
        cooling: "Mais tempo sem contato primeiro",
        newest: "Mais recentes primeiro",
        oldest: "Mais antigos primeiro",
        value: "Maior valor primeiro",
        closing: "Fechamento mais próximo",
        client: "Cliente A–Z",
      },
      board: {
        more_stages: "Mais etapas",
        previous_stages: "Anteriores",
      },
      focus: {
        title: "Comece por aqui",
        progress: "%{done} de %{total} feitos. Só estes pedem você hoje.",
        empty: "Nada está esperando você agora.",
        days_without_contact: "%{days} dias sem contato",
        talked: "Já falei",
        done: "Feito",
        marked: "Marcado como contatado",
        all_done: "Tudo certo por agora.",
        next: "Mostrar os próximos",
        all_title: "Todos os negócios",
        closed_summary: "Fechadas e paradas:",
      },
    },
  },
  crm: {
    onboarding: {
      menu_dashboard: "Tour do painel",
      menu_deals: "Tour de Deals",
      next: "Próximo",
      previous: "Voltar",
      done: "Concluir",
      skip: "Pular tour",
      progress: "%{current} de %{total}",
      dashboard: {
        welcome: {
          title: "Bem-vinda ao seu painel",
          description:
            "Um tour de 1 minuto para você saber onde está cada coisa. Pode sair quando quiser.",
        },
        filters: {
          title: "Filtros",
          description_admin:
            "Veja a clínica toda ou escolha uma colaboradora, e troque o período.",
          description_member:
            "Aqui você vê só os seus números. Troque o período quando quiser.",
        },
        kpis: {
          title: "Seus 4 números principais",
          description:
            "Conversão, ticket médio, vendas e tarefas atrasadas. A seta compara com o período anterior.",
        },
        tabs: {
          title: "Uma aba por assunto",
          description: "Agenda, Vendas, Leads, Equipe, Clientes e Atividade.",
        },
        agenda: {
          title: "A agenda do dia",
          description:
            "Suas tarefas de hoje por horário. Clique numa tarefa para abrir o contato.",
        },
        team: {
          title: "Aba Equipe",
          description:
            "Quem vende mais, quem perde mais e se o follow-up está em dia.",
        },
        calendar: {
          title: "Calendário",
          description:
            "Veja o mês, a semana ou a lista. Cada cor é uma colaboradora.",
        },
        tools: {
          title: "Busca e perfil",
          description:
            "Busque qualquer contato aqui. Para rever este tour, use o menu do perfil.",
        },
      },
      deals: {
        views: {
          title: "Dois jeitos de olhar",
          description:
            "O Quadro mostra todas as etapas. O Foco mostra só os poucos negócios que pedem você hoje.",
        },
        board: {
          title: "Seu quadro de vendas",
          description:
            "Cada coluna é uma etapa da venda, com a contagem e o total. Role para o lado para ver as próximas.",
        },
        card: {
          title: "Um card de negócio",
          description:
            "Cliente e empresa. Passe o mouse para ver a colaboradora, a data e as etiquetas. Clique para abrir, ou arraste para a próxima etapa.",
        },
        cooling: {
          title: "Tempo sem contato",
          description:
            "Um número aparece depois de 2 dias sem contato. Vermelho suave quer dizer 7 dias ou mais.",
        },
        sort: {
          title: "Organize cada coluna",
          description:
            "Coloque primeiro os que estão há mais tempo sem contato, os maiores ou os mais recentes.",
        },
        filters: {
          title: "Busca e filtros",
          description:
            'Filtre por empresa, procedimento ou colaboradora. "Only deals I manage" mostra só os seus.',
        },
        new: {
          title: "Novo negócio",
          description: "Aqui você cria um negócio novo.",
        },
        empty_intro: {
          title: "Seu quadro está vazio",
          description:
            "Os negócios que você criar aparecem aqui, uma coluna por etapa.",
        },
        empty_create: {
          title: "Crie o primeiro negócio",
          description: "Crie um aqui ou importe um arquivo CSV.",
        },
      },
    },
    calendar: {
      title: "Calendário",
      empty: "Nenhuma tarefa neste período.",
      truncated:
        "Mostrando só as primeiras %{count} tarefas. Algumas podem estar faltando.",
    },
    dashboard: {
      title: "Painel",
      truncated:
        "Mostrando só os primeiros %{count} registros de cada lista. Alguns números podem estar incompletos.",
      filters: {
        period: "Período",
        periods: {
          "7d": "Últimos 7 dias",
          "30d": "Últimos 30 dias",
          "90d": "Últimos 90 dias",
          "6m": "Últimos 6 meses",
          "12m": "Últimos 12 meses",
        },
        salesperson: "Colaboradora",
        everyone: "Todas",
        only_yours: "Mostrando só os seus números",
      },
      kpi: {
        conversion: "Conversão de leads",
        conversion_hint: "%{won} vendas de %{leads} contatos novos",
        average_ticket: "Ticket médio",
        average_ticket_hint: "por venda ganha",
        won_amount: "Vendas ganhas",
        won_amount_hint: "%{count} negócios fechados",
        overdue_tasks: "Tarefas atrasadas",
        overdue_tasks_hint: "abertas e com prazo vencido",
        vs_previous: "vs. período anterior",
        points: "pontos",
        no_data: "Sem dados",
      },
      tabs: {
        agenda: "Agenda",
        sales: "Vendas",
        leads: "Leads",
        team: "Equipe",
        clients: "Clientes",
        activity: "Atividade",
      },
      charts: {
        empty: "Nada para mostrar neste período ainda.",
        contacts_unit: "contatos",
        won: "Ganhas",
        lost: "Perdidas",
        won_vs_lost: "Vendas ganhas × perdidas",
        won_vs_lost_hint: "pela data de fechamento",
        by_category: "Receita por procedimento",
        by_category_hint: "negócios ganhos",
        leads_by_day: "Contatos novos por dia",
        leads_by_week: "Contatos novos por semana",
        leads_by_month: "Contatos novos por mês",
        leads_hint: "%{count} no período",
        funnel: "Funil de vendas",
        funnel_hint: "negócios criados no período, pela etapa atual",
        funnel_contacts: "Contatos novos",
        growth: "Crescimento da base",
        growth_hint: "contatos novos por semana",
        growth_this_week:
          "Esta semana: %{count} (%{change} vs. semana anterior)",
        portfolio: "Contatos por colaboradora",
        unassigned: "Sem responsável",
        team_results: "Ganhos × perdas por colaboradora",
        team_results_hint: "no período",
        most_wins: "Mais vendas: %{name} (%{count})",
        most_losses: "Mais perdas: %{name} (%{count})",
        win_rate: "%{rate}% de ganho",
        follow_up: "Follow-up em dia",
        follow_up_hint: "tarefas feitas no prazo",
        overdue_count: "%{smart_count} atrasada |||| %{smart_count} atrasadas",
        dormant: "Quem sumiu",
        dormant_hint: "%{count} contatos sem retorno há mais de %{days} dias",
        dormant_last_seen: "Último contato",
        dormant_days: "%{days} dias",
        dormant_none: "Ninguém sumiu.",
        top_clients: "Clientes que mais gastaram",
        top_clients_hint: "negócios ganhos, desde o início",
        purchases: "%{smart_count} compra |||| %{smart_count} compras",
      },
      latest_activity: "Atividade recente",
      upcoming_tasks: "Próximas tarefas",
    },
  },
};
