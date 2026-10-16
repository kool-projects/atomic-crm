import type { CrmMessages } from "./englishCrmMessages";

export const frenchCrmMessages = {
  resources: {
    companies: {
      name: "Entreprise |||| Entreprises",
      forcedCaseName: "Entreprise",
      fields: {
        name: "Nom de l'entreprise",
        website: "Site web",
        linkedin_url: "LinkedIn",
        phone_number: "Numéro de téléphone",
        created_at: "Date de création",
        nb_contacts: "Nombre de contacts",
        revenue: "Chiffre d'affaires",
        sector: "Secteur",
        size: "Taille",
        tax_identifier: "Identifiant fiscal",
        address: "Adresse",
        city: "Ville",
        zipcode: "Code postal",
        state_abbr: "État",
        country: "Pays",
        description: "Description",
        context_links: "URLs de contexte",
        sales_id: "Responsable de compte",
      },
      empty: {
        description: "Il semble que la liste de vos entreprises soit vide.",
        title: "Aucune entreprise trouvée",
      },
      import: {
        title: "Importer des entreprises",
      },
      field_categories: {
        contact: "Contact",
        additional_info: "Informations supplémentaires",
        address: "Adresse",
        context: "Contexte",
      },
      action: {
        create: "Créer une entreprise",
        edit: "Modifier l'entreprise",
        new: "Nouvelle entreprise",
        show: "Afficher l'entreprise",
      },
      added_on: "Ajoutée le %{date}",
      followed_by: "Suivie par %{name}",
      followed_by_you: "Suivie par vous",
      no_contacts: "Aucun contact",
      nb_contacts: "%{smart_count} contact |||| %{smart_count} contacts",
      nb_deals: "%{smart_count} affaire |||| %{smart_count} affaires",
      sizes: {
        one_employee: "1 employé",
        two_to_nine_employees: "2-9 employés",
        ten_to_forty_nine_employees: "10-49 employés",
        fifty_to_two_hundred_forty_nine_employees: "50-249 employés",
        two_hundred_fifty_or_more_employees: "250 employés ou plus",
      },
      autocomplete: {
        create_error:
          "Une erreur s'est produite lors de la création de l'entreprise",
        create_item: "Créer %{item}",
        create_label: "Commencez à taper pour créer une nouvelle entreprise",
      },
    },
    contacts: {
      name: "Contact |||| Contacts",
      forcedCaseName: "Contact",
      field_categories: {
        background_info: "Informations complémentaires",
        identity: "Identité",
        misc: "Divers",
        personal_info: "Informations personnelles",
        position: "Poste",
      },
      fields: {
        first_name: "Prénom",
        last_name: "Nom",
        last_seen: "Dernière activité",
        title: "Titre",
        company_id: "Entreprise",
        email_jsonb: "Adresses e-mail",
        email: "E-mail",
        phone_jsonb: "Numéros de téléphone",
        phone_number: "Numéro de téléphone",
        linkedin_url: "URL LinkedIn",
        background: "Informations de contexte",
        has_newsletter: "Abonné à la newsletter",
        sales_id: "Responsable de compte",
      },
      action: {
        add: "Ajouter un contact",
        add_first: "Ajoutez votre premier contact",
        create: "Créer un contact",
        edit: "Modifier le contact",
        export_vcard: "Exporter en vCard",
        new: "Nouveau contact",
        show: "Afficher le contact",
      },
      background: {
        last_activity_on: "Dernière activité le %{date}",
        added_on: "Ajouté le %{date}",
        followed_by: "Suivi par %{name}",
        followed_by_you: "Suivi par vous",
        status_none: "Aucun",
      },
      position_at: "%{title} chez",
      position_at_company: "%{title} chez %{company}",
      empty: {
        description: "Il semble que votre liste de contacts soit vide.",
        title: "Aucun contact trouvé",
      },
      import: {
        title: "Importer des contacts",
      },
      inputs: {
        genders: {
          male: "Monsieur",
          female: "Madame",
          nonbinary: "Indéterminé",
        },
        personal_info_types: {
          work: "Pro",
          home: "Perso",
          other: "Autre",
        },
      },
      list: {
        error_loading: "Erreur lors du chargement des contacts",
      },
      bulk_tag: {
        action: "Étiqueter",
        back: "Retour aux étiquettes",
        create_description:
          "Créez une nouvelle étiquette et appliquez-la aux contacts sélectionnés.",
        description:
          "Choisissez une étiquette existante ou créez-en une pour les contacts sélectionnés.",
        empty:
          "Aucune étiquette pour le moment. Créez-en une pour étiqueter les contacts sélectionnés.",
        error: "Impossible d'ajouter l'étiquette aux contacts",
        removed:
          "Étiquette retirée de %{smart_count} contact |||| Étiquette retirée de %{smart_count} contacts",
        success:
          "Étiquette ajoutée à %{smart_count} contact |||| Étiquette ajoutée à %{smart_count} contacts",
        title: "Ajouter une étiquette aux contacts",
      },
      merge: {
        action: "Fusionner avec un autre contact",
        confirm: "Fusionner les contacts",
        current_contact: "Contact actuel (sera supprimé)",
        description: "Fusionnez ce contact avec un autre.",
        error: "Échec de la fusion des contacts",
        merging: "Fusion...",
        no_additional_data: "Aucune donnée supplémentaire à fusionner",
        select_target: "Veuillez sélectionner un contact avec lequel fusionner",
        success: "Contacts fusionnés avec succès",
        target_contact: "Contact cible (sera conservé)",
        title: "Fusionner les contacts",
        warning_description:
          "Toutes les données seront transférées au deuxième contact. Cette action ne peut pas être annulée.",
        warning_title: "Avertissement : opération destructrice",
        what_will_be_merged: "Ce qui sera fusionné :",
      },
      filters: {
        before_last_month: "Avant le mois dernier",
        before_this_month: "Avant ce mois-ci",
        before_this_week: "Avant cette semaine",
        managed_by_me: "Géré par moi",
        search: "Rechercher nom, entreprise...",
        this_week: "Cette semaine",
        today: "Aujourd'hui",
        tags: "Étiquettes",
        tasks: "Tâches",
      },
      hot: {
        empty_change_status:
          'Changez le statut d\'un contact en ajoutant une note à ce contact et en cliquant sur "afficher les options".',
        empty_hint: 'Les contacts avec un statut "chaud" apparaîtront ici.',
        title: "Contacts chauds",
      },
    },
    deals: {
      name: "Affaire |||| Affaires",
      fields: {
        name: "Nom",
        description: "Description",
        company_id: "Entreprise",
        contact_ids: "Contacts",
        category: "Catégorie",
        amount: "Budget",
        expected_closing_date: "Date de clôture prévue",
        stage: "Étape",
      },
      action: {
        back_to_deal: "Retour à l'affaire",
        create: "Créer une affaire",
        new: "Nouvelle affaire",
      },
      field_categories: {
        misc: "Divers",
      },
      filters: {
        only_mine: "Seulement les affaires que je gère",
      },
      card: {
        age_short: "%{days} j",
        age_title:
          "Sans contact depuis %{days} jours · dernière interaction : %{date}",
      },
      view: {
        label: "Vue",
        board: "Tableau",
        focus: "Focus",
        show_details: "Afficher les détails",
      },
      sort: {
        label: "Trier les cartes",
        manual: "Mon ordre (glisser)",
        cooling: "Plus longtemps sans contact d'abord",
        newest: "Plus récentes d'abord",
        oldest: "Plus anciennes d'abord",
        value: "Plus grande valeur d'abord",
        closing: "Clôture la plus proche",
        client: "Client A–Z",
      },
      board: {
        more_stages: "Autres étapes",
        previous_stages: "Précédentes",
      },
      focus: {
        title: "Commencez ici",
        progress:
          "%{done} sur %{total} faits. Seules celles-ci vous attendent aujourd'hui.",
        empty: "Rien ne vous attend pour l'instant.",
        days_without_contact: "%{days} jours sans contact",
        talked: "Je leur ai parlé",
        done: "Fait",
        marked: "Marqué comme contacté",
        all_done: "Tout est en ordre pour le moment.",
        next: "Afficher les suivantes",
        all_title: "Toutes les affaires",
        closed_summary: "Clôturées et en pause :",
      },
      archived: {
        action: "Archiver",
        error: "Erreur : affaire non archivée",
        list_title: "Affaires archivées",
        success: "Affaire archivée",
        title: "Affaire archivée",
        view: "Afficher les affaires archivées",
      },
      inputs: {
        linked_to: "Lié à",
      },
      unarchived: {
        action: "Renvoyer au tableau",
        error: "Erreur : affaire non désarchivée",
        success: "Affaire désarchivée",
      },
      updated: "Affaire mise à jour",
      empty: {
        before_create: "avant de créer une affaire.",
        description: "Il semble que votre liste d'affaires soit vide.",
        title: "Aucune affaire trouvée",
      },
      import: {
        title: "Importer des affaires",
      },
      invalid_date: "Date invalide",
    },
    notes: {
      name: "Note |||| Notes",
      forcedCaseName: "Note",
      fields: {
        status: "Statut",
        date: "Date",
        attachments: "Pièces jointes",
        contact_id: "Contact",
        deal_id: "Affaire",
      },
      action: {
        add: "Ajouter une note",
        add_first: "Ajoutez votre première note",
        delete: "Supprimer la note",
        edit: "Modifier la note",
        update: "Mettre à jour la note",
        add_this: "Ajouter cette note",
      },
      sheet: {
        create: "Créer une note",
        create_for: "Créer une note pour %{name}",
        edit: "Modifier la note",
        edit_for: "Modifier la note pour %{name}",
      },
      deleted: "Note supprimée",
      empty: "Aucune note pour l'instant",
      author_added: "%{name} a ajouté une note",
      you_added: "Vous avez ajouté une note",
      me: "Moi",
      list: {
        error_loading: "Erreur lors du chargement des notes",
      },
      note_for_contact: "Note pour %{name}",
      stepper: {
        hint: "Accédez à une page de contact et ajoutez une note",
      },
      added: "Note ajoutée",
      inputs: {
        add_note: "Ajouter une note",
        options_hint: "(joindre des fichiers ou modifier les détails)",
        show_options: "Afficher les options",
      },
      actions: {
        attach_document: "Joindre un document",
      },
      validation: {
        note_or_attachment_required: "Une note ou une pièce jointe est requise",
      },
    },
    sales: {
      name: "Utilisateur |||| Utilisateurs",
      fields: {
        first_name: "Prénom",
        last_name: "Nom",
        email: "E-mail",
        secondary_email: "E-mail secondaire",
        secondary_emails: "E-mails secondaires",
        administrator: "Admin",
        disabled: "Désactivé",
      },
      create: {
        error:
          "Une erreur s'est produite lors de la création de l'utilisateur.",
        success:
          "Utilisateur créé. Ils recevront prochainement un email pour définir leur mot de passe.",
        title: "Créer un nouvel utilisateur",
      },
      edit: {
        error: "Une erreur s'est produite. Veuillez réessayer.",
        record_not_found: "Enregistrement introuvable",
        success: "Utilisateur mis à jour avec succès",
        title: "Modifier %{name}",
      },
      action: {
        new: "Nouvel utilisateur",
      },
    },
    tasks: {
      name: "Tâche |||| Tâches",
      forcedCaseName: "Tâche",
      fields: {
        text: "Description",
        due_date: "Date d'échéance",
        type: "Type",
        contact_id: "Contact",
        due_short: "échéance",
      },
      action: {
        add: "Ajouter une tâche",
        create: "Créer une tâche",
        edit: "Modifier la tâche",
      },
      actions: {
        postpone_next_week: "Reporté à la semaine prochaine",
        postpone_tomorrow: "Reporter à demain",
        title: "Actions de tâche",
      },
      added: "Tâche ajoutée",
      deleted: "Tâche supprimée avec succès",
      dialog: {
        create: "Créer une tâche",
        create_for: "Créer une tâche pour %{name}",
      },
      sheet: {
        edit: "Modifier la tâche",
        edit_for: "Modifier la tâche pour %{name}",
      },
      empty: "Aucune tâche pour l'instant",
      empty_list_hint: "Les tâches ajoutées à vos contacts apparaîtront ici.",
      filters: {
        later: "Plus tard",
        overdue: "En retard",
        this_week: "Cette semaine",
        today: "Aujourd'hui",
        tomorrow: "Demain",
        with_pending: "Avec des tâches en attente",
      },
      regarding_contact: "(Concernant : %{name})",
      updated: "Tâche mise à jour",
    },
    tags: {
      name: "Étiquette |||| Étiquettes",
      action: {
        add: "Ajouter une étiquette",
        create: "Créer une nouvelle étiquette",
      },
      dialog: {
        color: "Couleur",
        create_title: "Créer une nouvelle étiquette",
        edit_title: "Modifier l'étiquette",
        name_label: "Nom de l'étiquette",
        name_placeholder: "Saisir le nom de l'étiquette",
      },
      empty: "Aucune étiquette pour le moment.",
    },
  },
  crm: {
    action: {
      reset_password: "Réinitialiser le mot de passe",
    },
    auth: {
      first_name: "Prénom",
      last_name: "Nom",
      confirm_password: "Confirmer le mot de passe",
      confirmation_required:
        "Veuillez suivre le lien que nous venons de vous envoyer par email pour confirmer votre compte.",
      recovery_email_sent:
        "Si vous êtes un utilisateur enregistré, vous devriez recevoir prochainement un e-mail de récupération de mot de passe.",
      sign_in_failed: "Échec de la connexion.",
      sign_in_google_workspace: "Connectez-vous avec Google Workplace",
      signup: {
        create_account: "Créer un compte",
        create_first_user:
          "Créez le premier compte utilisateur pour terminer la configuration.",
        creating: "Création...",
        initial_user_created: "Utilisateur initial créé avec succès",
      },
      welcome_title: "Bienvenue sur Atomic CRM",
    },
    common: {
      account_manager: "Responsable de compte",
      activity: "Activité",
      added: "ajoutée",
      details: "Détails",
      last_activity_with_date: "dernière activité %{date}",
      load_more: "Charger plus",
      misc: "Divers",
      past: "Passé",
      read_more: "En savoir plus",
      retry: "Réessayer",
      show_less: "Afficher moins",
      task_count: "%{smart_count} tâche |||| %{smart_count} tâches",
      copied: "Copié !",
      copy: "Copier",
      loading: "Chargement...",
      me: "Moi",
    },
    changelog: {
      title: "Notes de version",
    },
    activity: {
      added_company: "%{name} a ajouté l'entreprise",
      you_added_company: "Vous avez ajouté l'entreprise",
      added_contact: "%{name} a ajouté le contact",
      you_added_contact: "Vous avez ajouté le contact",
      added_note: "%{name} a ajouté une note sur",
      you_added_note: "Vous avez ajouté une note sur",
      added_note_about_deal: "%{name} a ajouté une note sur l'affaire",
      you_added_note_about_deal: "Vous avez ajouté une note sur l'affaire",
      added_deal: "%{name} a ajouté l'affaire",
      you_added_deal: "Vous avez ajouté l'affaire",
      at_company: "chez",
      to: "à",
      load_more: "Charger plus d'activité",
    },
    onboarding: {
      menu_dashboard: "Visite du tableau de bord",
      menu_deals: "Visite des affaires",
      next: "Suivant",
      previous: "Retour",
      done: "Terminer",
      skip: "Passer la visite",
      progress: "%{current} sur %{total}",
      dashboard: {
        welcome: {
          title: "Bienvenue sur votre tableau de bord",
          description:
            "Une visite d'une minute pour savoir où se trouve chaque chose. Vous pouvez quitter à tout moment.",
        },
        filters: {
          title: "Filtres",
          description_admin:
            "Voyez toute la clinique ou choisissez un commercial, et changez la période.",
          description_member:
            "Ici, vous ne voyez que vos propres chiffres. Changez la période quand vous voulez.",
        },
        kpis: {
          title: "Vos quatre chiffres clés",
          description:
            "Conversion des leads, panier moyen, ventes et tâches en retard. La flèche compare avec la période précédente.",
        },
        tabs: {
          title: "Un onglet par sujet",
          description: "Agenda, Ventes, Leads, Équipe, Clients et Activité.",
        },
        agenda: {
          title: "L'agenda du jour",
          description:
            "Vos tâches du jour, par horaire. Cliquez sur l'une d'elles pour ouvrir le contact.",
        },
        team: {
          title: "Onglet Équipe",
          description:
            "Qui vend le plus, qui perd le plus, et si le suivi est fait dans les délais.",
        },
        calendar: {
          title: "Calendrier",
          description:
            "Voyez le mois, la semaine ou une liste. Chaque couleur est un commercial.",
        },
        tools: {
          title: "Recherche et profil",
          description:
            "Cherchez un contact ici. Pour revoir cette visite, utilisez le menu du profil.",
        },
      },
      deals: {
        views: {
          title: "Deux façons de regarder",
          description:
            "Le tableau montre toutes les étapes. Focus ne montre que les quelques affaires qui vous attendent aujourd'hui.",
        },
        board: {
          title: "Votre tableau de ventes",
          description:
            "Chaque colonne est une étape de la vente, avec son nombre et son total. Faites défiler sur le côté pour voir les suivantes.",
        },
        card: {
          title: "Une carte d'affaire",
          description:
            "Client et entreprise. Survolez pour voir le commercial, la date et les étiquettes. Cliquez pour ouvrir, ou glissez vers l'étape suivante.",
        },
        cooling: {
          title: "Temps sans contact",
          description:
            "Un nombre apparaît après 2 jours sans contact. Rouge doux : 7 jours ou plus.",
        },
        sort: {
          title: "Trier chaque colonne",
          description:
            "Mettez en premier les plus longtemps sans contact, les plus grosses ou les plus récentes.",
        },
        filters: {
          title: "Recherche et filtres",
          description:
            "Filtrez par entreprise, procédure ou commercial. « Seulement les affaires que je gère » n'affiche que les vôtres.",
        },
        new: {
          title: "Nouvelle affaire",
          description: "Créez une nouvelle affaire ici.",
        },
        empty_intro: {
          title: "Votre tableau est vide",
          description:
            "Les affaires que vous créez apparaîtront ici, une colonne par étape.",
        },
        empty_create: {
          title: "Créez votre première affaire",
          description: "Créez-en une ici, ou importez un fichier CSV.",
        },
      },
    },
    calendar: {
      title: "Calendrier",
      empty: "Aucune tâche sur cette période.",
      truncated:
        "Seules les %{count} premières tâches sont affichées : certaines peuvent manquer.",
    },
    dashboard: {
      title: "Tableau de bord",
      truncated:
        "Seuls les %{count} premiers enregistrements de chaque liste sont affichés : certains chiffres peuvent être incomplets.",
      filters: {
        period: "Période",
        periods: {
          "7d": "7 derniers jours",
          "30d": "30 derniers jours",
          "90d": "90 derniers jours",
          "6m": "6 derniers mois",
          "12m": "12 derniers mois",
        },
        salesperson: "Commercial",
        everyone: "Tout le monde",
        only_yours: "Vos chiffres uniquement",
      },
      kpi: {
        conversion: "Conversion des leads",
        conversion_hint: "%{won} ventes pour %{leads} nouveaux contacts",
        average_ticket: "Panier moyen",
        average_ticket_hint: "par affaire gagnée",
        won_amount: "Ventes gagnées",
        won_amount_hint: "%{count} affaires conclues",
        overdue_tasks: "Tâches en retard",
        overdue_tasks_hint: "ouvertes et échues",
        vs_previous: "vs période précédente",
        points: "pts",
        no_data: "Aucune donnée",
      },
      tabs: {
        agenda: "Agenda",
        sales: "Ventes",
        leads: "Leads",
        team: "Équipe",
        clients: "Clients",
        activity: "Activité",
      },
      charts: {
        empty: "Rien à afficher pour cette période.",
        contacts_unit: "contacts",
        won: "Gagnées",
        lost: "Perdues",
        won_vs_lost: "Ventes gagnées × perdues",
        won_vs_lost_hint: "par date de clôture",
        by_category: "Revenus par catégorie",
        by_category_hint: "affaires gagnées",
        leads_by_day: "Nouveaux contacts par jour",
        leads_by_week: "Nouveaux contacts par semaine",
        leads_by_month: "Nouveaux contacts par mois",
        leads_hint: "%{count} sur la période",
        funnel: "Entonnoir de vente",
        funnel_hint: "affaires créées sur la période, par étape actuelle",
        funnel_contacts: "Nouveaux contacts",
        growth: "Croissance des contacts",
        growth_hint: "nouveaux contacts par semaine",
        growth_this_week:
          "Cette semaine : %{count} (%{change} vs semaine dernière)",
        portfolio: "Contacts par commercial",
        unassigned: "Non assigné",
        team_results: "Gagnées × perdues par commercial",
        team_results_hint: "sur la période",
        most_wins: "Plus de ventes : %{name} (%{count})",
        most_losses: "Plus de pertes : %{name} (%{count})",
        win_rate: "%{rate}% gagnées",
        follow_up: "Suivi dans les délais",
        follow_up_hint: "tâches faites avant leur échéance",
        overdue_count: "%{smart_count} en retard |||| %{smart_count} en retard",
        dormant: "Contacts silencieux",
        dormant_hint:
          "%{count} contacts sans nouvelles depuis plus de %{days} jours",
        dormant_last_seen: "Dernier contact",
        dormant_days: "%{days} jours",
        dormant_none: "Aucun contact silencieux.",
        top_clients: "Meilleurs clients",
        top_clients_hint: "affaires gagnées, depuis le début",
        purchases: "%{smart_count} achat |||| %{smart_count} achats",
      },
      deals_chart: "Revenus des affaires à venir",
      deals_pipeline: "Pipeline des affaires",
      latest_activity: "Dernière activité",
      latest_activity_error:
        "Erreur lors du chargement de la dernière activité",
      latest_notes: "Mes dernières notes",
      latest_notes_added_ago: "ajouté %{timeAgo}",
      stepper: {
        install: "Installer Atomic CRM",
        progress: "%{step}/3 terminé",
        whats_next: "Et ensuite ?",
      },
      upcoming_tasks: "Tâches à venir",
    },
    data_import: {
      button: "Importer un fichier CSV",
      complete:
        "Import terminé. %{importCount} enregistrements importés, %{errorCount} erreurs",
      csv_file: "Fichier CSV",
      error:
        "Échec de l'importation de ce fichier. Veuillez vous assurer que vous avez fourni un fichier CSV valide.",
      in_progress: "Import en cours…",
      progress:
        "%{importCount} / %{rowCount} enregistrements importés, avec %{errorCount} erreurs.",
      remaining_time: "Temps restant estimé :",
      resource: "Ressource",
      sample_download: "Télécharger un exemple CSV",
      sample_hint:
        "Voici un exemple de fichier CSV que vous pouvez utiliser comme modèle",
      start: "Démarrer l'import",
      stop: "Arrêter l'importation",
      stopped:
        "Import arrêté. %{importCount} enregistrements importés, %{errorCount} erreurs",
      title: "Importer des données",
    },
    header: {
      import_data: "Importer depuis JSON",
    },
    search: {
      title: "Rechercher",
      placeholder:
        "Rechercher un contact, une entreprise, une affaire, une tâche, une note...",
      hint: "Saisissez au moins %{min} caractères pour lancer la recherche",
      empty: "Aucun résultat",
      error:
        "La recherche est indisponible pour le moment. Veuillez réessayer.",
      untitled_result: "(sans titre)",
      groups: {
        contacts: "Contacts",
        companies: "Entreprises",
        deals: "Affaires",
        tasks: "Tâches",
        contact_notes: "Notes de contact",
        deal_notes: "Notes d'affaire",
      },
    },
    image_editor: {
      change: "Changer",
      drop_hint:
        "Déposez un fichier à télécharger ou cliquez pour le sélectionner.",
      editable_content: "Contenu modifiable",
      title: "Télécharger et redimensionner l'image",
      update_image: "Mettre à jour l'image",
    },
    import: {
      action: {
        download_error_report: "Téléchargez le rapport d'erreur",
        import: "Importer",
        import_another: "Importer un autre fichier",
      },
      error: {
        unable: "Impossible d'importer ce fichier.",
      },
      idle: {
        description_1:
          "Vous pouvez importer des ventes, des entreprises, des contacts, des entreprises, des notes et des tâches.",
        description_2:
          "Les données doivent se trouver dans un fichier JSON correspondant à l'exemple suivant :",
      },
      status: {
        all_success: "Tous les enregistrements ont été importés avec succès.",
        complete: "Importation terminée.",
        failed: "Échoué",
        imported: "Importé",
        in_progress: "Import en cours, veuillez ne pas quitter cette page.",
        some_failed: "Certains enregistrements n'ont pas été importés.",
        table_caption: "Statut d'importation",
      },
      title: "Importer depuis JSON",
    },
    settings: {
      about: "À propos",
      color_scheme: {
        accent: "Couleur d'accent",
        help: "Choisissez un préréglage ou vos propres couleurs. Le contraste s'ajuste seul en mode clair et sombre.",
        neutral: "Teinte de base",
        title: "Palette de couleurs",
      },
      companies: {
        sectors: "Secteurs",
      },
      dark_mode_logo: "Logo du mode sombre",
      deals: {
        categories: "Catégories",
        currency: "Devise",
        pipeline_help:
          "Sélectionnez les étapes d'affaire à considérer comme des affaires dans le pipeline.",
        pipeline_statuses: "Statuts des pipelines",
        stages: "Étapes",
      },
      light_mode_logo: "Logo du mode clair",
      notes: {
        statuses: "Statuts",
      },
      reset_defaults: "Réinitialiser aux valeurs par défaut",
      save_error: "Échec de l'enregistrement de la configuration",
      saved: "Configuration enregistrée avec succès",
      saving: "Enregistrement...",
      tasks: {
        types: "Types",
      },
      preferences: "Préférences",
      title: "Paramètres",
      app_title: "Titre de l'application",
      sections: {
        branding: "Image de marque",
      },
      validation: {
        duplicate: "%{display_name} en double : %{items}",
        in_use:
          "Impossible de supprimer %{display_name} encore utilisés par des affaires : %{items}",
        validating: "Validation\u2026",
        entities: {
          categories: "catégories",
          stages: "étapes",
        },
      },
    },
    theme: {
      dark: "Sombre",
      label: "Thème",
      light: "Clair",
      system: "Système",
    },
    language: "Langue",
    navigation: {
      label: "Navigation CRM",
    },
    profile: {
      add_secondary_email: "Ajouter un e-mail",
      email_taken: "%{email} est déjà utilisée par un autre utilisateur",
      no_secondary_emails: "Aucun",
      secondary_email_invalid: "%{email} n'est pas une adresse e-mail valide",
      secondary_email_is_primary: "%{email} est déjà votre adresse principale",
      secondary_email_taken:
        "%{email} est déjà utilisée par un autre utilisateur",
      too_many_secondary_emails:
        "Vous ne pouvez pas ajouter plus de 10 adresses e-mail secondaires",
      secondary_emails_help:
        "Autres adresses depuis lesquelles vous envoyez des e-mails. Laissez-en une vide pour la supprimer.",
      inbound: {
        description:
          "Vous pouvez commencer à envoyer des e-mails vers l'adresse de réception de votre serveur, par exemple en l'ajoutant au champ %{field}. Atomic CRM traitera les e-mails et ajoutera des notes aux contacts correspondants.",
        title: "E-mail entrant",
      },
      mcp: {
        title: "Serveur MCP",
        description:
          "Utilisez cette URL pour connecter votre assistant IA aux données de votre CRM via le Model Context Protocol (MCP).",
      },
      password: {
        change: "Changer le mot de passe",
      },
      password_reset_sent:
        "Un e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail",
      record_not_found: "Enregistrement introuvable",
      title: "Profil",
      updated: "Votre profil a été mis à jour",
      update_error: "Une erreur s'est produite. Veuillez réessayer",
    },
    validation: {
      invalid_url: "Doit être une URL valide",
      invalid_linkedin_url: "L'URL doit provenir de linkedin.com",
    },
  },
} satisfies CrmMessages;
