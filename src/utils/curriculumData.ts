import { BacStream, BacStreamId, Subject } from '../types';

export const BAC_STREAMS: BacStream[] = [
  {
    id: 'sciences_exp',
    nameAr: 'شعبة العلوم التجريبية',
    nameFr: 'Sciences Expérimentales',
    nameEn: 'Experimental Sciences',
    descriptionAr: 'تركيز مكثف على العلوم الطبيعية، الرياضيات، والفيزياء والكيمياء',
    descriptionFr: 'Filière axée sur la biologie, les mathématiques et la physique-chimie',
    descriptionEn: 'Focus on natural sciences, mathematics, physics, and chemistry',
    badge: 'Sci-Exp'
  },
  {
    id: 'mathematiques',
    nameAr: 'شعبة الرياضيات',
    nameFr: 'Mathématiques',
    nameEn: 'Mathematics Stream',
    descriptionAr: 'معامل 7 في الرياضيات ومعامل 6 في الفيزياء: الشعبة النخبوية للعلوم الدقيقة',
    descriptionFr: 'Coefficient 7 en maths et 6 en physique : l’excellence des sciences exactes',
    descriptionEn: 'High-rigor focus on pure math (coeff 7) and physical sciences (coeff 6)',
    badge: 'Maths'
  },
  {
    id: 'technique_math_meca',
    nameAr: 'تقني رياضي - هندسة ميكانيكية',
    nameFr: 'Technique Math - Génie Mécanique',
    nameEn: 'Math Tech - Mechanical Engineering',
    descriptionAr: 'هندسة الأنظمة الميكانيكية، الرياضيات المعمقة، والفيزياء التطبيقية',
    descriptionFr: 'Étude des systèmes mécaniques, mathématiques et physique appliquée',
    descriptionEn: 'Mechanical systems, advanced math, and applied physics',
    badge: 'TM-Meca'
  },
  {
    id: 'technique_math_civil',
    nameAr: 'تقني رياضي - هندسة مدنية',
    nameFr: 'Technique Math - Génie Civil',
    nameEn: 'Math Tech - Civil Engineering',
    descriptionAr: 'دراسة المنشآت ومقاومة المواد وحساب الهياكل',
    descriptionFr: 'Calcul de structures, résistance des matériaux et construction',
    descriptionEn: 'Structures design, material resistance, and building physics',
    badge: 'TM-Civil'
  },
  {
    id: 'technique_math_elec',
    nameAr: 'تقني رياضي - هندسة كهربائية',
    nameFr: 'Technique Math - Génie Électrique',
    nameEn: 'Math Tech - Electrical Engineering',
    descriptionAr: 'الدوائر المنطقية، الميكروكنترولر، والتحكم الآلي',
    descriptionFr: 'Circuits logiques, automatisme et microcontrôleurs',
    descriptionEn: 'Logic circuits, automated systems, and electronics',
    badge: 'TM-Elec'
  },
  {
    id: 'technique_math_procedes',
    nameAr: 'تقني رياضي - هندسة الطرائق',
    nameFr: 'Technique Math - Génie des Procédés',
    nameEn: 'Math Tech - Process Engineering',
    descriptionAr: 'الكيمياء الصناعية، العمليات الكيميائية، والتحولات الحيوية',
    descriptionFr: 'Chimie industrielle, génie chimique et bilans de matière',
    descriptionEn: 'Industrial chemistry and chemical manufacturing processes',
    badge: 'TM-Procédés'
  },
  {
    id: 'gestion_economie',
    nameAr: 'شعبة تسيير واقتصاد',
    nameFr: 'Gestion et Économie',
    nameEn: 'Management and Economics',
    descriptionAr: 'المحاسبة والتحليل المالي، الاقتصاد والمناجمنت، والقانون والرياضيات',
    descriptionFr: 'Comptabilité et gestion financière, économie-management et droit',
    descriptionEn: 'Accounting, financial analysis, economics, law, and math',
    badge: 'Éco-Gestion'
  },
  {
    id: 'lettres_philo',
    nameAr: 'شعبة آداب وفلسفة',
    nameFr: 'Lettres et Philosophie',
    nameEn: 'Literature and Philosophy',
    descriptionAr: 'الفلسفة المعمقة واللغة العربية والأدب، والتاريخ والجغرافيا',
    descriptionFr: 'Philosophie approfondie, langue et littérature arabe, histoire-géo',
    descriptionEn: 'Advanced philosophy, Arabic literature, history, and humanities',
    badge: 'Philo'
  },
  {
    id: 'langues_etrangeres',
    nameAr: 'شعبة لغات أجنبية',
    nameFr: 'Langues Étrangères',
    nameEn: 'Foreign Languages',
    descriptionAr: 'التمكن من اللغات: العربية، الفرنسية، الإنجليزية، ولغة ثالثة (إسبانية/ألمانية/إيطالية)',
    descriptionFr: 'Maîtrise linguistique : arabe, français, anglais et 3ème langue',
    descriptionEn: 'Multilingual proficiency: Arabic, French, English, and a third language',
    badge: 'Langues'
  }
];

export function getInitialSubjectsForStream(streamId: BacStreamId): Subject[] {
  const subjects = (() => {
    switch (streamId) {
    case 'sciences_exp':
      return [
        {
          id: 'snv_sci',
          nameAr: 'علوم الطبيعة والحياة',
          nameFr: 'Sciences de la Nature et de la Vie',
          nameEn: 'Natural & Life Sciences',
          streamId,
          coefficient: 6,
          icon: 'Dna',
          color: '#10B981',
          confidence: 70,
          targetScore: 17,
          chapters: [
            {
              id: 'snv_u1',
              titleAr: 'الوحدة 1: آليات تركيب البروتين',
              titleFr: 'Unité 1 : Synthèse des protéines',
              titleEn: 'Unit 1: Protein Synthesis Mechanisms',
              order: 1,
              topics: [
                { id: 'snv_t1', titleAr: 'مقر تركيب البروتين والاستنساخ', titleFr: 'Transcription de l’ARNm', titleEn: 'mRNA Transcription', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'snv_t2', titleAr: 'مرحلة الترجمة والشفرة الوراثية', titleFr: 'Traduction et code génétique', titleEn: 'Translation & Genetic Code', status: 'practising', difficulty: 3, isDifficult: false },
              ]
            },
            {
              id: 'snv_u2',
              titleAr: 'الوحدة 2: العلاقة بين بنية ووظيفة البروتين',
              titleFr: 'Unité 2 : Structure et fonction des protéines',
              titleEn: 'Unit 2: Structure & Function of Proteins',
              order: 2,
              topics: [
                { id: 'snv_t3', titleAr: 'مستويات البنية الفراغية والروابط الكيميائية', titleFr: 'Niveaux structuraux et liaisons', titleEn: 'Structural Levels & Bonds', status: 'learning', difficulty: 3, isDifficult: false },
                { id: 'snv_t4', titleAr: 'السلوك الأمفوتيري للأحماض الأمينية والكهربائي الهجرة', titleFr: 'Comportement amphotère et électrophorèse', titleEn: 'Amphoteric Behavior & Electrophoresis', status: 'practising', difficulty: 4, isDifficult: true },
              ]
            },
            {
              id: 'snv_u3',
              titleAr: 'الوحدة 3: النشاط الإنزيمي للبروتينات',
              titleFr: 'Unité 3 : Activité enzymatique',
              titleEn: 'Unit 3: Enzymatic Activity',
              order: 3,
              topics: [
                { id: 'snv_t5', titleAr: 'بنية الموقع الفعال والتأثير النوعي للإنزيم', titleFr: 'Site actif et spécificité du substrat', titleEn: 'Active Site & Substrate Specificity', status: 'revising', difficulty: 2, isDifficult: false },
                { id: 'snv_t6', titleAr: 'تأثير درجة الحرارة والـ pH على سرعة التفاعل الإنزيمي', titleFr: 'Effet de la température et du pH', titleEn: 'Temperature & pH Effect', status: 'tested', difficulty: 3, isDifficult: false },
              ]
            },
            {
              id: 'snv_u4',
              titleAr: 'الوحدة 4: دور البروتينات في الدفاع عن الذات (المناعة)',
              titleFr: 'Unité 4 : Immunologie et défense du soi',
              titleEn: 'Unit 4: Immunology & Self Defense',
              order: 4,
              topics: [
                { id: 'snv_t7', titleAr: 'الذات واللاذات ونظام الـ CMH ومجموعات الدم ABO والريزوس', titleFr: 'Soi et non-soi (CMH, ABO, Rhésus)', titleEn: 'Self & Non-Self (MHC, ABO, Rh)', status: 'revising', difficulty: 3, isDifficult: false },
                { id: 'snv_t8', titleAr: 'الاستجابة المناعية الخلطية (LB) والمعقد المناعي', titleFr: 'Réponse humorale (Lymphocytes B)', titleEn: 'Humoral Immunity (B Cells)', status: 'practising', difficulty: 4, isDifficult: true },
                { id: 'snv_t9', titleAr: 'الاستجابة المناعية الخلوية (LTc) وظاهرة البلعمة', titleFr: 'Réponse cellulaire (Lymphocytes T)', titleEn: 'Cellular Immunity (T Cells)', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'snv_t10', titleAr: 'فيروس فقدان المناعة المكتسبة (VIH)', titleFr: 'Virus du VIH et sida', titleEn: 'HIV Mechanism', status: 'not_started', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'snv_u5',
              titleAr: 'الوحدة 5: الاتصال العصبي والظواهر الكهربائية',
              titleFr: 'Unité 5 : Communication nerveuse',
              titleEn: 'Unit 5: Nervous Communication',
              order: 5,
              topics: [
                { id: 'snv_t11', titleAr: 'كمون الراحة وقنوات التسرب ومضخة Na+/K+', titleFr: 'Potentiel de repos et pompe Na/K', titleEn: 'Resting Potential & Na/K Pump', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'snv_t12', titleAr: 'كمون العمل وقنوات الفولطية ونقل السيالة في المشابك', titleFr: 'Potentiel d’action et synapse', titleEn: 'Action Potential & Synapses', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            }
          ]
        },
        {
          id: 'math_sci',
          nameAr: 'الرياضيات',
          nameFr: 'Mathématiques',
          nameEn: 'Mathematics',
          streamId,
          coefficient: 5,
          icon: 'Calculator',
          color: '#3B82F6',
          confidence: 65,
          targetScore: 16.5,
          chapters: [
            {
              id: 'm_c1',
              titleAr: 'الدوال العددية والاشتقاقية والاستمرارية',
              titleFr: 'Fonctions numériques et continuité',
              titleEn: 'Numerical Functions & Continuity',
              order: 1,
              topics: [
                { id: 'm_t1', titleAr: 'النهايات وحالات عدم التعيين ونظرية القيم المتوسطة', titleFr: 'Limites et théorème des valeurs intermédiaires', titleEn: 'Limits & Intermediate Value Theorem', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'm_t2', titleAr: 'الاشتقاقية والمماسات ونقاط الانعطاف ونقطة التناظر', titleFr: 'Dérivation, tangentes et points d’inflexion', titleEn: 'Derivatives & Tangents', status: 'revising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'm_c2',
              titleAr: 'الدوال الأسية واللوغاريتمية النيبيرية',
              titleFr: 'Fonctions Exponentielle et Logarithme',
              titleEn: 'Exponential & Logarithmic Functions',
              order: 2,
              topics: [
                { id: 'm_t3', titleAr: 'الدالة الأسية ودراسة إشارة العبارات ودوال الوسيط m', titleFr: 'Fonction exponentielle et discussion paramétrique', titleEn: 'Exponential Function & Parameters', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'm_t4', titleAr: 'الدالة اللوغاريتمية النيبيرية وحساب المساحات والتكامل', titleFr: 'Fonction logarithme népérien et intégration', titleEn: 'Natural Logarithm & Integration', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            },
            {
              id: 'm_c3',
              titleAr: 'المتتاليات العددية والبرهان بالتراجع',
              titleFr: 'Suites numériques et récurrence',
              titleEn: 'Numerical Sequences & Induction',
              order: 3,
              topics: [
                { id: 'm_t5', titleAr: 'البرهان بالتراجع واتجاه التغير والتقارب', titleFr: 'Raisonnement par récurrence et convergence', titleEn: 'Mathematical Induction & Convergence', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'm_t6', titleAr: 'المتتاليات الحسابية والهندسية وحساب المجاميع والجداءات', titleFr: 'Suites arithmétiques/géométriques et sommes', titleEn: 'Arithmetic & Geometric Progressions', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'm_c4',
              titleAr: 'الاحتمالات والمتغير العشوائي',
              titleFr: 'Probabilités et variable aléatoire',
              titleEn: 'Probabilities & Random Variables',
              order: 4,
              topics: [
                { id: 'm_t7', titleAr: 'العد التوفيقي والترتيبات وشجرة الاحتمالات الشرطية', titleFr: 'Dénombrement et probabilités conditionnelles', titleEn: 'Combinatorics & Conditional Probability', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'm_t8', titleAr: 'قانون الاحتمال للمتغير العشوائي والأمل الرياضي والتباين', titleFr: 'Loi de probabilité, espérance et variance', titleEn: 'Probability Distribution & Variance', status: 'not_started', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'm_c5',
              titleAr: 'الهندسة في الفضاء والجداء السلمي',
              titleFr: 'Géométrie dans l’espace',
              titleEn: 'Solid Geometry & Dot Product',
              order: 5,
              topics: [
                { id: 'm_t9', titleAr: 'المعادلات الديكارتية للمستويات والمستقيمات والمسافة', titleFr: 'Équations de plans, droites et distances', titleEn: 'Planes & Lines Equations', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'm_t10', titleAr: 'سطح الكرة والتقاطع مع المستوي والمستقيم', titleFr: 'Sphère et intersections', titleEn: 'Sphere & Intersections', status: 'not_started', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'm_c6',
              titleAr: 'الأعداد المركبة والتحويلات النقطية',
              titleFr: 'Nombres complexes',
              titleEn: 'Complex Numbers',
              order: 6,
              topics: [
                { id: 'm_t11', titleAr: 'الشكل الجبري والمثلثي والآسي وعمدة عدد مركب', titleFr: 'Formes algébrique, trigonométrique et exponentielle', titleEn: 'Algebraic, Polar & Exponential Forms', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'm_t12', titleAr: 'التحويلات النقطية: الانسحاب، التحاكي، والدوران وتعيين طبيعة المثلث', titleFr: 'Transformations : translation, homothétie, rotation', titleEn: 'Transformations: Translation, Rotation', status: 'learning', difficulty: 5, isDifficult: true }
              ]
            }
          ]
        },
        {
          id: 'phys_sci',
          nameAr: 'العلوم الفيزيائية',
          nameFr: 'Sciences Physiques',
          nameEn: 'Physical Sciences',
          streamId,
          coefficient: 5,
          icon: 'Atom',
          color: '#8B5CF6',
          confidence: 60,
          targetScore: 16,
          chapters: [
            {
              id: 'p_c1',
              titleAr: 'الوحدة 1: المتابعة الزمنية لتحول كيميائي في وسط مائي',
              titleFr: 'Unité 1 : Cinétique chimique',
              titleEn: 'Unit 1: Chemical Kinetics & Monitoring',
              order: 1,
              topics: [
                { id: 'p_t1', titleAr: 'جدول التقدم وتعيين المتفاعل المحد وزمن نصف التفاعل t1/2', titleFr: 'Tableau d’avancement et temps de demi-réaction', titleEn: 'Progress Table & Half-Life Time', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'p_t2', titleAr: 'المتابعة بقياس الناقلية، المعايرة اللونية، وضغط وحجم الغاز', titleFr: 'Suivi par conductimétrie et titrage', titleEn: 'Conductimetry & Titration Monitoring', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'p_c2',
              titleAr: 'الوحدة 2: التحولات النووية (النشاط الإشعاعي والطاقة)',
              titleFr: 'Unité 2 : Réactions nucléaires',
              titleEn: 'Unit 2: Nuclear Physics & Decay',
              order: 2,
              topics: [
                { id: 'p_t3', titleAr: 'الأنشطة الإشعاعية ألفا، بيتا، غاما وقانون التناقص الإشعاعي', titleFr: 'Lois de Soddy et loi de décroissance', titleEn: 'Decay Law & Radiations', status: 'revising', difficulty: 2, isDifficult: false },
                { id: 'p_t4', titleAr: 'طاقة الربط النووي، النقص الكتلي، والانشطار والاندماج', titleFr: 'Énergie de liaison, fission et fusion', titleEn: 'Binding Energy, Fission & Fusion', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'p_c3',
              titleAr: 'الوحدة 3: الظواهر الكهربائية (ثنائي القطب RC و RL)',
              titleFr: 'Unité 3 : Phénomènes électriques (RC et RL)',
              titleEn: 'Unit 3: RC & RL Electrical Circuits',
              order: 3,
              topics: [
                { id: 'p_t5', titleAr: 'شحن وتفريغ المكثفة والمعادلات التفاضلية وثابت الزمن طاو', titleFr: 'Charge et décharge du condensateur (RC)', titleEn: 'Capacitor Charge & Differential Equations', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'p_t6', titleAr: 'ظاهرة التحريض الكهرومغناطيسي في وشيعة حقيقية (RL)', titleFr: 'Comportement d’une bobine inductive (RL)', titleEn: 'Inductive Coils & RL Differential Equations', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            },
            {
              id: 'p_c4',
              titleAr: 'الوحدة 4: تطور جملة كيميائية نحو حالة التوازن (الأحماض والأسس)',
              titleFr: 'Unité 4 : Acides et bases',
              titleEn: 'Unit 4: Acids & Bases Equilibrium',
              order: 4,
              topics: [
                { id: 'p_t7', titleAr: 'الـ pH، نسبة التقدم النهائي، وثابت الحموضة Ka والـ pKa', titleFr: 'pH, taux d’avancement final et Ka', titleEn: 'pH, Final Progress Ratio & Ka', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'p_t8', titleAr: 'المعايرة الـ pH-مترية ونقطة التكافؤ واختيار الكواشف الملونة', titleFr: 'Dosage pH-métrique et zone de virage', titleEn: 'pH Titration & Equivalence Point', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            },
            {
              id: 'p_c5',
              titleAr: 'الوحدة 5: تطور جملة ميكانيكية (قوانين نيوتن والحركات)',
              titleFr: 'Unité 5 : Mécanique de Newton',
              titleEn: 'Unit 5: Newtonian Mechanics',
              order: 5,
              topics: [
                { id: 'p_t9', titleAr: 'حركة الكواكب والأقمار الاصطناعية وقوانين كبلر', titleFr: 'Mouvement des satellites et lois de Kepler', titleEn: 'Satellites & Kepler’s Laws', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'p_t10', titleAr: 'السقوط الشاقولي الحقيقي والحر في الهواء ومعادلة السرعة الحدية', titleFr: 'Chute verticale avec frottement et vitesse limite', titleEn: 'Vertical Fall with Drag & Limit Speed', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'p_t11', titleAr: 'حركة القذائف في مجال الثقالة المنتظم ومعادلة المسار', titleFr: 'Mouvement des projectiles', titleEn: 'Projectile Motion & Trajectory', status: 'learning', difficulty: 5, isDifficult: true },
                { id: 'p_t12', titleAr: 'حركة جسم صلب على مستوى مائل وأفقي وقوى الاحتكاك', titleFr: 'Plan incliné et horizontal avec frottements', titleEn: 'Inclined & Horizontal Planes', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'p_c6',
              titleAr: 'الوحدة 6: مراقبة تطور جملة كيميائية (الأسترة والحلمأة)',
              titleFr: 'Unité 6 : Estérification et hydrolyse',
              titleEn: 'Unit 6: Esterification & Hydrolysis',
              order: 6,
              topics: [
                { id: 'p_t13', titleAr: 'تسمية الإسترات، الكحول، والأحماض الكربوكسيلية وتفاعل الأسترة', titleFr: 'Nomenclature et réaction d’estérification', titleEn: 'Esters Nomenclature & Reaction', status: 'not_started', difficulty: 2, isDifficult: false },
                { id: 'p_t14', titleAr: 'مردود تفاعل الأسترة وطرق تحسينه (التسخين المرتد، نزع الماء)', titleFr: 'Rendement et contrôle de l’estérification', titleEn: 'Yield Optimization in Esterification', status: 'not_started', difficulty: 3, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'arab_sci',
          nameAr: 'اللغة العربية وآدابها',
          nameFr: 'Langue et Littérature Arabe',
          nameEn: 'Arabic Language & Literature',
          streamId,
          coefficient: 3,
          icon: 'BookOpen',
          color: '#EC4899',
          confidence: 80,
          targetScore: 16,
          chapters: [
            {
              id: 'ar_c1',
              titleAr: 'المحور 1: عصر الضعف والانحطاط والنهضة الأدبية',
              titleFr: 'Axe 1 : Poésie classique et déclin',
              titleEn: 'Part 1: Classical Poetry & Renaissance',
              order: 1,
              topics: [
                { id: 'ar_t1', titleAr: 'شعر المدائح النبوية والزهد (البوصيري وابن نباتة)', titleFr: 'Éloges prophétiques et ascétisme', titleEn: 'Prophetic Praises & Asceticism', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'ar_t2', titleAr: 'النثر العلمي والنثر العلمي المتأدب (ابن خلدون والقزويني)', titleFr: 'Prose scientifique chez Ibn Khaldoun', titleEn: 'Scientific Prose of Ibn Khaldun', status: 'revising', difficulty: 2, isDifficult: false }
              ]
            },
            {
              id: 'ar_c2',
              titleAr: 'المحور 2: الشعر المهجري والشعر السياسي التحرري',
              titleFr: 'Axe 2 : Poésie d’émigration et poésie engagée',
              titleEn: 'Part 2: Emigration & Committed Political Poetry',
              order: 2,
              topics: [
                { id: 'ar_t3', titleAr: 'مدرسة الرابطة القلمية ومبادئ النزعة الإنسانية والتأملية', titleFr: 'Ligue de la plume et poésie méditative', titleEn: 'Pen League & Reflective Poetry', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'ar_t4', titleAr: 'القضية الفلسطينية والثورة التحريرية الجزائرية في الشعر الحر (مفدي زكريا ومحمود درويش)', titleFr: 'Révolution algérienne et cause palestinienne', titleEn: 'Algerian Revolution & Palestine in Poetry', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'ar_c3',
              titleAr: 'المحور 3: القواعد اللغوية والبلاغة والعروض',
              titleFr: 'Axe 3 : Grammaire, rhétorique et prosodie',
              titleEn: 'Part 3: Grammar, Rhetoric & Meters',
              order: 3,
              topics: [
                { id: 'ar_t5', titleAr: 'إعراب إذ، إذا، إذن، حينئذ، ولولا، ولوما', titleFr: 'Analyse syntaxique de Idha et Idhan', titleEn: 'Parsing of Idha, Idhan & Lawla', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'ar_t6', titleAr: 'الجمل التي لها محل والتي لا محل لها من الإعراب', titleFr: 'Propositions avec et sans fonction syntaxique', titleEn: 'Phrases with & without Syntactic Function', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'ar_t7', titleAr: 'الصور البيانية (الاستعارة، التشبيه، الكناية) والمحسنات البديعية', titleFr: 'Figures de style (métaphore, métonymie)', titleEn: 'Figures of Speech & Rhetoric', status: 'confident', difficulty: 2, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'philo_sci',
          nameAr: 'الفلسفة',
          nameFr: 'Philosophie',
          nameEn: 'Philosophy',
          streamId,
          coefficient: 2,
          icon: 'Brain',
          color: '#F59E0B',
          confidence: 55,
          targetScore: 15,
          chapters: [
            {
              id: 'phi_c1',
              titleAr: 'المشكلة الأولى: في المشكلة الإشكالية والمنهجية الفلسفية',
              titleFr: 'Méthodologie de la dissertation philosophique',
              titleEn: 'Philosophical Dissertation Methodology',
              order: 1,
              topics: [
                { id: 'phi_t1', titleAr: 'منهجية المقالة الجدلية والمقارنة والاستقصاء بالوضع وتحليل النص', titleFr: 'Méthodes dialectique, comparative et plaidoyer', titleEn: 'Dialectical, Comparative & Defense Methods', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'phi_t2', titleAr: 'الفرق بين السؤال الفلسفي والسؤال العلمي', titleFr: 'Question philosophique vs scientifique', titleEn: 'Philosophical vs Scientific Questioning', status: 'confident', difficulty: 2, isDifficult: false }
              ]
            },
            {
              id: 'phi_c2',
              titleAr: 'المشكلة الثانية: فلسفة العلوم والرياضيات والبيولوجيا',
              titleFr: 'Épistémologie des sciences et mathématiques',
              titleEn: 'Epistemology of Sciences & Mathematics',
              order: 2,
              topics: [
                { id: 'phi_t3', titleAr: 'أصل المفاهيم الرياضية (بين العقل والتجربة الحسية)', titleFr: 'Origine des concepts mathématiques (raison vs sens)', titleEn: 'Origin of Math Concepts (Rationalism vs Empiricism)', status: 'revising', difficulty: 3, isDifficult: false },
                { id: 'phi_t4', titleAr: 'قيمة الرياضيات والبديهيات والمسلمات والأكسيوماتيك', titleFr: 'Crise des fondements et axiomatique moderne', titleEn: 'Axiomatics & Math Foundations', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'phi_t5', titleAr: 'العلوم التجريبية والملاحظة والفرضية ومبدأ الحتمية واللاحتمية', titleFr: 'Méthode expérimentale et déterminisme', titleEn: 'Scientific Method & Determinism', status: 'learning', difficulty: 3, isDifficult: false },
                { id: 'phi_t6', titleAr: 'انطباق المنهج التجريبي على المادة الحية (البيولوجيا وعوائقها)', titleFr: 'Expérimentation sur le vivant (bioéthique)', titleEn: 'Experimentation on Living Matter & Bioethics', status: 'practising', difficulty: 4, isDifficult: true }
              ]
            }
          ]
        },
        {
          id: 'hg_sci',
          nameAr: 'التاريخ والجغرافيا',
          nameFr: 'Histoire et Géographie',
          nameEn: 'History and Geography',
          streamId,
          coefficient: 2,
          icon: 'Globe',
          color: '#E11D48',
          confidence: 75,
          targetScore: 17,
          chapters: [
            {
              id: 'hg_c1',
              titleAr: 'تاريخ: بروز الصراع وتشكل العالم بعد الحرب العالمية الثانية',
              titleFr: 'Histoire : Guerre froide et nouvel ordre mondial',
              titleEn: 'History: Cold War & New World Order',
              order: 1,
              topics: [
                { id: 'hg_t1', titleAr: 'أسباب ونتائج الحرب الباردة واستراتيجيات المعسكرين (مبدأ ترومان، خطة مارشال، حلف وارسو)', titleFr: 'Stratégies des blocs (Truman, Marshall, Varsovie)', titleEn: 'Bloc Strategies (Truman, Marshall, Warsaw)', status: 'tested', difficulty: 2, isDifficult: false },
                { id: 'hg_t2', titleAr: 'مساعي التعايش السلمي والانفراج الدولي ودور حركة عدم الانحياز', titleFr: 'Coexistence pacifique et pays non-alignés', titleEn: 'Peaceful Coexistence & Non-Aligned Movement', status: 'confident', difficulty: 2, isDifficult: false }
              ]
            },
            {
              id: 'hg_c2',
              titleAr: 'تاريخ: العمل المسلح والثورة التحريرية الجزائرية (1954-1962)',
              titleFr: 'Histoire : Révolution algérienne (1954-1962)',
              titleEn: 'History: Algerian Revolution (1954-1962)',
              order: 2,
              topics: [
                { id: 'hg_t3', titleAr: 'اندلاع الثورة، نداء أول نوفمبر، وهجومات الشمال القسنطيني 1955', titleFr: 'Déclenchement et offensive du Nord-Constantinois', titleEn: 'Outbreak & North Constantine Offensives', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'hg_t4', titleAr: 'مؤتمر الصومام 1956، قراراته العسكرية والسياسية، والدبلوماسية الجزائرية', titleFr: 'Congrès de la Soummam et diplomatie du FLN', titleEn: 'Soummam Congress & Algerian Diplomacy', status: 'revising', difficulty: 3, isDifficult: false },
                { id: 'hg_t5', titleAr: 'المخططات الاستعمارية (شال، ديغول) والمفاوضات واتفاقيات إيفيان واسترجاع السيادة', titleFr: 'Plans coloniaux et accords d’Évian', titleEn: 'Colonial Counter-Plans & Evian Accords', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'hg_c3',
              titleAr: 'جغرافيا: واقع الاقتصاد العالمي والتنمية والقوى الكبرى',
              titleFr: 'Géographie : Économie mondiale et pôles de puissance',
              titleEn: 'Geography: Global Economy & Power Hubs',
              order: 3,
              topics: [
                { id: 'hg_t6', titleAr: 'إشكالية التقدم والتخلف ومؤشرات التنمية البشرية وحركة رؤوس الأموال والسلع', titleFr: 'Développement vs sous-développement et flux', titleEn: 'Development vs Underdevelopment & Capital Flows', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'hg_t7', titleAr: 'سوق البترول والغاز وأسواق الحبوب ودور منظمة أوبك في الاقتصاد الدولي', titleFr: 'Marchés pétroliers, gaziers et céréaliers', titleEn: 'Oil, Gas & Wheat Strategic Markets', status: 'practising', difficulty: 3, isDifficult: false },
                { id: 'hg_t8', titleAr: 'القوى الاقتصادية الكبرى: الولايات المتحدة، الاتحاد الأوروبي، وشرق وجنوب شرق آسيا', titleFr: 'Pôles mondiaux (USA, UE, Asie orientale)', titleEn: 'Global Economic Superpowers (USA, EU, Asia)', status: 'learning', difficulty: 3, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'isl_sci',
          nameAr: 'العلوم الإسلامية',
          nameFr: 'Sciences Islamiques',
          nameEn: 'Islamic Sciences',
          streamId,
          coefficient: 2,
          icon: 'Moon',
          color: '#059669',
          confidence: 85,
          targetScore: 18,
          chapters: [
            {
              id: 'isl_c1',
              titleAr: 'العقيدة، القرآن، والفكر الإسلامي',
              titleFr: 'Foi, Coran et pensée islamique',
              titleEn: 'Faith, Quran & Islamic Thought',
              order: 1,
              topics: [
                { id: 'isl_t1', titleAr: 'العقيدة الإسلامية وأثرها على الفرد والمجتمع ووسائل تثبيتها في القرآن', titleFr: 'La foi islamique et son impact individuel et social', titleEn: 'Islamic Creed & Quranic Anchor Methods', status: 'confident', difficulty: 1, isDifficult: false },
                { id: 'isl_t2', titleAr: 'مقاصد الشريعة الإسلامية (الضروريات الخمس، الحاجيات، التحسينيات)', titleFr: 'Les finalités de la charia (Maqasid)', titleEn: 'Objectives of Sharia (Maqasid)', status: 'tested', difficulty: 2, isDifficult: false },
                { id: 'isl_t3', titleAr: 'الصحة النفسية والجسمية في القرآن الكريم', titleFr: 'Santé mentale et physique dans le Coran', titleEn: 'Mental & Physical Health in Quran', status: 'confident', difficulty: 1, isDifficult: false }
              ]
            },
            {
              id: 'isl_c2',
              titleAr: 'المعاملات المالية والأسرة في التشريع الإسلامي',
              titleFr: 'Transactions financières et famille',
              titleEn: 'Financial Transactions & Family Law',
              order: 2,
              topics: [
                { id: 'isl_t4', titleAr: 'الربا وأنواعه وعلته والمعاملات المالية المعاصرة (الصرف، بيع التقسيط)', titleFr: 'L’usure (Riba) et transactions modernes', titleEn: 'Riba & Contemporary Financial Transactions', status: 'revising', difficulty: 3, isDifficult: false },
                { id: 'isl_t5', titleAr: 'الميراث في الإسلام وحالات الورثة وطرق الحساب', titleFr: 'Droit successoral et calcul des parts', titleEn: 'Inheritance Rules & Distribution Calculation', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            }
          ]
        },
        {
          id: 'fr_sci',
          nameAr: 'اللغة الفرنسية',
          nameFr: 'Français',
          nameEn: 'French Language',
          streamId,
          coefficient: 2,
          icon: 'Languages',
          color: '#3B82F6',
          confidence: 70,
          targetScore: 15,
          chapters: [
            {
              id: 'fr_c1',
              titleAr: 'النص التاريخي (Le texte d’histoire)',
              titleFr: 'Le texte d’histoire et témoignages',
              titleEn: 'Historical Narrative & Testimonies',
              order: 1,
              topics: [
                { id: 'fr_t1', titleAr: 'الوقائع التاريخية، الشواهد، وعلامات الزمن والذاتية/الموضوعية', titleFr: 'Faits, témoignages et indices d’énonciation', titleEn: 'Historical Facts & Testimonies Analysis', status: 'tested', difficulty: 2, isDifficult: false },
                { id: 'fr_t2', titleAr: 'منهجية التلخيص وتقنية الـ Compte-rendu objectif et critique', titleFr: 'Compte-rendu objectif et critique', titleEn: 'Objective & Critical Summary Writing', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'fr_c2',
              titleAr: 'النص الحجاجي (Le texte argumentatif / débat d’idées)',
              titleFr: 'Le débat d’idées et texte argumentatif',
              titleEn: 'Debate of Ideas & Argumentative Text',
              order: 2,
              topics: [
                { id: 'fr_t3', titleAr: 'الحجج والأمثلة، أدوات الربط المنطقي، واستراتيجيات الإقناع', titleFr: 'Connecteurs logiques et stratégie argumentative', titleEn: 'Logical Connectors & Persuasion Strategies', status: 'revising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'fr_c3',
              titleAr: 'النداء الإنساني (L’appel)',
              titleFr: 'L’appel et texte incitatif',
              titleEn: 'Incentive Call & Humanitarian Appeals',
              order: 3,
              topics: [
                { id: 'fr_t4', titleAr: 'بنية النداء، أفعال الأمر والرجاء، والالتزام الإنساني', titleFr: 'Structure de l’appel et verbes d’action', titleEn: 'Structure of Appeals & Action Verbs', status: 'confident', difficulty: 2, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'en_sci',
          nameAr: 'اللغة الإنجليزية',
          nameFr: 'Anglais',
          nameEn: 'English Language',
          streamId,
          coefficient: 2,
          icon: 'Globe2',
          color: '#6366F1',
          confidence: 80,
          targetScore: 17,
          chapters: [
            {
              id: 'en_c1',
              titleAr: 'الوحدة 1: الأخلاقيات في الأعمال (Ethics in Business)',
              titleFr: 'Unit 1 : Ethics in Business',
              titleEn: 'Unit 1: Ethics in Business',
              order: 1,
              topics: [
                { id: 'en_t1', titleAr: 'محاربة الفساد والرشوة وتبييض الأموال (Bribery & Counterfeiting)', titleFr: 'Corruption, contrefaçon et blanchiment d’argent', titleEn: 'Corruption, Counterfeiting & Money Laundering', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'en_t2', titleAr: 'القواعد: صيغ التمني، الشرط if-conditionals، والتعبير عن الإلزام', titleFr: 'Grammar : Wishes, conditionals and obligation', titleEn: 'Grammar: Wishes, Conditionals & Obligation', status: 'tested', difficulty: 2, isDifficult: false }
              ]
            },
            {
              id: 'en_c2',
              titleAr: 'الوحدة 2: الأمن الغذائي والمستهلك (Safety First)',
              titleFr: 'Unit 2 : Safety First & Food Safety',
              titleEn: 'Unit 2: Safety First & Food Safety',
              order: 2,
              topics: [
                { id: 'en_t3', titleAr: 'الإعلانات، الوجبات السريعة، وعادات المستهلك الغذائية والصحية', titleFr: 'Publicité, malbouffe et santé du consommateur', titleEn: 'Advertising, Junk Food & Health', status: 'revising', difficulty: 2, isDifficult: false }
              ]
            },
            {
              id: 'en_c3',
              titleAr: 'الوحدة 3: علم الفلك واستكشاف الفضاء (Astronomy)',
              titleFr: 'Unit 3 : Astronomy & The Solar System',
              titleEn: 'Unit 3: Astronomy & The Solar System',
              order: 3,
              topics: [
                { id: 'en_t4', titleAr: 'النظام الشمسي، الأقمار، واكتشاف الكواكب والكون', titleFr: 'Système solaire et exploration spatiale', titleEn: 'Solar System & Space Exploration', status: 'confident', difficulty: 1, isDifficult: false }
              ]
            }
          ]
        }
      ];

    case 'mathematiques':
      // Return subjects tailored for Mathematics stream (Math coeff 7, Phys coeff 6, etc.)
      const mathSubjects = getInitialSubjectsForStream('sciences_exp');
      return mathSubjects.map(s => {
        if (s.id === 'math_sci') return { ...s, coefficient: 7, targetScore: 17.5 };
        if (s.id === 'phys_sci') return { ...s, coefficient: 6, targetScore: 17 };
        if (s.id === 'snv_sci') return { ...s, coefficient: 2, targetScore: 14 };
        return s;
      });

    case 'technique_math_meca':
    case 'technique_math_civil':
    case 'technique_math_elec':
    case 'technique_math_procedes':
      const techSubjects = getInitialSubjectsForStream('sciences_exp').filter(s => s.id !== 'snv_sci');
      // Replace SNV with Tech Specialty module coeff 6, Maths coeff 6, Phys coeff 6
      const specName = streamId === 'technique_math_meca' ? 'الهندسة الميكانيكية' :
        streamId === 'technique_math_civil' ? 'الهندسة المدنية' :
        streamId === 'technique_math_elec' ? 'الهندسة الكهربائية' : 'هندسة الطرائق';
      return [
        {
          id: 'tech_spec',
          nameAr: specName,
          nameFr: streamId === 'technique_math_meca' ? 'Génie Mécanique' : streamId === 'technique_math_civil' ? 'Génie Civil' : streamId === 'technique_math_elec' ? 'Génie Électrique' : 'Génie des Procédés',
          nameEn: 'Technical Specialty Engineering',
          streamId,
          coefficient: 6,
          icon: 'Wrench',
          color: '#EA580C',
          confidence: 70,
          targetScore: 17,
          chapters: [
            {
              id: 'tech_c1',
              titleAr: 'الوحدة 1: دراسة النظم والآليات والمخططات التقنية',
              titleFr: 'Unité 1 : Systèmes et schémas techniques',
              titleEn: 'Unit 1: Technical Systems & Schematics',
              order: 1,
              topics: [
                { id: 'tech_t1', titleAr: 'التحليل الوظيفي الشامل للأنظمة ومخطط FAST و SADT', titleFr: 'Analyse fonctionnelle (FAST, SADT)', titleEn: 'Functional Analysis (FAST, SADT)', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'tech_t2', titleAr: 'دفتر الشروط والمردود الميكانيكي/الطاقوي', titleFr: 'Cahier des charges et rendement', titleEn: 'Specifications & Efficiency', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'tech_c2',
              titleAr: 'الوحدة 2: الحسابات التقنية ومقاومة المواد والصناعة',
              titleFr: 'Unité 2 : Résistance des matériaux et calculs',
              titleEn: 'Unit 2: Material Resistance & Calculations',
              order: 2,
              topics: [
                { id: 'tech_t3', titleAr: 'الشد والضغط والقص البسيط وعزم الانحناء', titleFr: 'Traction, compression et cisaillement', titleEn: 'Tension, Compression & Shear Stress', status: 'learning', difficulty: 4, isDifficult: true }
              ]
            }
          ]
        },
        ...techSubjects.map(s => {
          if (s.id === 'math_sci') return { ...s, coefficient: 6 };
          if (s.id === 'phys_sci') return { ...s, coefficient: 6 };
          return s;
        })
      ];

    case 'gestion_economie':
      return [
        {
          id: 'gest_compta',
          nameAr: 'التسيير المحاسبي والمالي',
          nameFr: 'Gestion Comptable et Financière',
          nameEn: 'Financial & Accounting Management',
          streamId,
          coefficient: 6,
          icon: 'Coins',
          color: '#059669',
          confidence: 75,
          targetScore: 17,
          chapters: [
            {
              id: 'compta_c1',
              titleAr: 'الوحدة 1: أعمال نهاية السنة والتسويات المحاسبية',
              titleFr: 'Travaux de fin d’exercice et régularisations',
              titleEn: 'Year-End Accounting Adjustments',
              order: 1,
              topics: [
                { id: 'c_t1', titleAr: 'الاهتلاكات (الخطي والمتناقص) وخسائر القيمة عن التثبيتات', titleFr: 'Amortissements et dépréciations d’actifs', titleEn: 'Depreciations & Asset Impairments', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'c_t2', titleAr: 'تسوية حسابات المخزونات وفوارق الجرد وحساب الزبائن المشكوك فيهم', titleFr: 'Régularisation des stocks et créances douteuses', titleEn: 'Inventory Adjustments & Doubtful Debts', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'compta_c2',
              titleAr: 'الوحدة 2: إعداد وتحليل القوائم المالية وجداول حسابات النتائج',
              titleFr: 'États financiers et analyse par ratios',
              titleEn: 'Financial Statements & Ratio Analysis',
              order: 2,
              topics: [
                { id: 'c_t3', titleAr: 'حساب النتائج حسب الطبيعة وحسب الوظيفة وقدرة التمويل الذاتي CAF', titleFr: 'Compte de résultat et CAF', titleEn: 'Income Statement & Self-Financing Capacity', status: 'learning', difficulty: 4, isDifficult: true },
                { id: 'c_t4', titleAr: 'تحليل الميزانية الوظيفية (BFR, FRNG, TN) ونسب الهيكلة المالية', titleFr: 'Bilan fonctionnel (FRNG, BFR, TN)', titleEn: 'Functional Balance Sheet (Working Capital)', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'gest_eco',
          nameAr: 'الاقتصاد والمناجمنت',
          nameFr: 'Économie et Management',
          nameEn: 'Economics and Management',
          streamId,
          coefficient: 5,
          icon: 'TrendingUp',
          color: '#2563EB',
          confidence: 70,
          targetScore: 16,
          chapters: [
            {
              id: 'eco_c1',
              titleAr: 'المحور 1: النقود والنظام المصرفي والتضخم والبطالة',
              titleFr: 'Monnaie, banques, inflation et chômage',
              titleEn: 'Money, Banking, Inflation & Unemployment',
              order: 1,
              topics: [
                { id: 'e_t1', titleAr: 'النقود: وظائفها، أشكالها، والكتلة النقدية وإصدار النقد', titleFr: 'Masse monétaire et création de monnaie', titleEn: 'Money Supply & Currency Creation', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'e_t2', titleAr: 'البنوك والسياسة النقدية وسعر الفائدة والبنك المركزي', titleFr: 'Banque centrale et politique monétaire', titleEn: 'Central Bank & Monetary Policy', status: 'tested', difficulty: 2, isDifficult: false },
                { id: 'e_t3', titleAr: 'ظاهرة التضخم: أسبابه، آثاره على الاقتصاد، وطرق معالجته', titleFr: 'Causes et conséquences de l’inflation', titleEn: 'Causes & Remedying of Inflation', status: 'revising', difficulty: 3, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'gest_math',
          nameAr: 'الرياضيات',
          nameFr: 'Mathématiques',
          nameEn: 'Mathematics',
          streamId,
          coefficient: 5,
          icon: 'Calculator',
          color: '#7C3AED',
          confidence: 65,
          targetScore: 15,
          chapters: []
        },
        {
          id: 'gest_droit',
          nameAr: 'القانون',
          nameFr: 'Droit',
          nameEn: 'Law',
          streamId,
          coefficient: 2,
          icon: 'Scale',
          color: '#B45309',
          confidence: 80,
          targetScore: 17,
          chapters: []
        },
        {
          id: 'gest_philo',
          nameAr: 'الفلسفة',
          nameFr: 'Philosophie',
          nameEn: 'Philosophy',
          streamId,
          coefficient: 2,
          icon: 'Brain',
          color: '#F59E0B',
          confidence: 60,
          targetScore: 14,
          chapters: []
        },
        {
          id: 'gest_arab',
          nameAr: 'اللغة العربية وآدابها',
          nameFr: 'Langue Arabe',
          nameEn: 'Arabic Language',
          streamId,
          coefficient: 3,
          icon: 'BookOpen',
          color: '#EC4899',
          confidence: 75,
          targetScore: 15,
          chapters: []
        },
        {
          id: 'gest_hg',
          nameAr: 'التاريخ والجغرافيا',
          nameFr: 'Histoire-Géo',
          nameEn: 'History-Geo',
          streamId,
          coefficient: 4,
          icon: 'Globe',
          color: '#E11D48',
          confidence: 75,
          targetScore: 16,
          chapters: []
        },
        {
          id: 'gest_isl',
          nameAr: 'العلوم الإسلامية',
          nameFr: 'Sciences Islamiques',
          nameEn: 'Islamic Sciences',
          streamId,
          coefficient: 2,
          icon: 'Moon',
          color: '#059669',
          confidence: 85,
          targetScore: 18,
          chapters: []
        },
        {
          id: 'gest_fr',
          nameAr: 'اللغة الفرنسية',
          nameFr: 'Français',
          nameEn: 'French',
          streamId,
          coefficient: 2,
          icon: 'Languages',
          color: '#3B82F6',
          confidence: 70,
          targetScore: 15,
          chapters: []
        },
        {
          id: 'gest_en',
          nameAr: 'اللغة الإنجليزية',
          nameFr: 'Anglais',
          nameEn: 'English',
          streamId,
          coefficient: 2,
          icon: 'Globe2',
          color: '#6366F1',
          confidence: 75,
          targetScore: 16,
          chapters: []
        }
      ];

    case 'lettres_philo':
      return [
        {
          id: 'lp_philo',
          nameAr: 'الفلسفة (معامل 6)',
          nameFr: 'Philosophie approfondie',
          nameEn: 'Advanced Philosophy',
          streamId,
          coefficient: 6,
          icon: 'Brain',
          color: '#F59E0B',
          confidence: 65,
          targetScore: 16,
          chapters: [
            {
              id: 'lp_c1',
              titleAr: 'إشكالية الفكر بين المبدأ والواقع (المنطق الأرسطي والرياضي)',
              titleFr: 'Logique formelle et logique inductive',
              titleEn: 'Formal & Inductive Logic',
              order: 1,
              topics: [
                { id: 'lp_t1', titleAr: 'انطباق الفكر مع نفسه وقوانين الهوية وعدم التناقض والقياس', titleFr: 'Logique d’Aristote et syllogisme', titleEn: 'Aristotelian Syllogism & Identity Laws', status: 'confident', difficulty: 2, isDifficult: false },
                { id: 'lp_t2', titleAr: 'انطباق الفكر مع الواقع والمنهج الاستقرائي والفرضية العلمية', titleFr: 'Méthode inductive et sciences expérimentales', titleEn: 'Inductive Logic & Empirical Reality', status: 'practising', difficulty: 3, isDifficult: false }
              ]
            },
            {
              id: 'lp_c2',
              titleAr: 'إشكالية العلاقات بين الناس (الحرية والمسؤولية والعنف والتسامح)',
              titleFr: 'Liberté, responsabilité, violence et justice',
              titleEn: 'Freedom, Responsibility & Social Justice',
              order: 2,
              topics: [
                { id: 'lp_t3', titleAr: 'الحرية والمسؤولية بين الحتمية المطلقة والاختيار الحر', titleFr: 'Déterminisme vs libre arbitre', titleEn: 'Determinism vs Free Will', status: 'revising', difficulty: 3, isDifficult: false },
                { id: 'lp_t4', titleAr: 'العنف والتسامح، والعدالة الاجتماعية بين المساواة والاستحقاق', titleFr: 'Violence, tolérance et justice distributive', titleEn: 'Violence, Tolerance & Social Justice', status: 'tested', difficulty: 3, isDifficult: false }
              ]
            }
          ]
        },
        {
          id: 'lp_arabe',
          nameAr: 'اللغة العربية وآدابها (معامل 6)',
          nameFr: 'Langue et Littérature Arabe',
          nameEn: 'Arabic Literature',
          streamId,
          coefficient: 6,
          icon: 'BookOpen',
          color: '#EC4899',
          confidence: 75,
          targetScore: 16.5,
          chapters: []
        },
        {
          id: 'lp_hg',
          nameAr: 'التاريخ والجغرافيا',
          nameFr: 'Histoire-Géo',
          nameEn: 'History & Geo',
          streamId,
          coefficient: 4,
          icon: 'Globe',
          color: '#E11D48',
          confidence: 80,
          targetScore: 17,
          chapters: []
        },
        {
          id: 'lp_fr',
          nameAr: 'اللغة الفرنسية',
          nameFr: 'Français',
          nameEn: 'French',
          streamId,
          coefficient: 3,
          icon: 'Languages',
          color: '#3B82F6',
          confidence: 70,
          targetScore: 15,
          chapters: []
        },
        {
          id: 'lp_en',
          nameAr: 'اللغة الإنجليزية',
          nameFr: 'Anglais',
          nameEn: 'English',
          streamId,
          coefficient: 3,
          icon: 'Globe2',
          color: '#6366F1',
          confidence: 75,
          targetScore: 16,
          chapters: []
        },
        {
          id: 'lp_isl',
          nameAr: 'العلوم الإسلامية',
          nameFr: 'Sciences Islamiques',
          nameEn: 'Islamic Sciences',
          streamId,
          coefficient: 2,
          icon: 'Moon',
          color: '#059669',
          confidence: 85,
          targetScore: 18,
          chapters: []
        },
        {
          id: 'lp_math',
          nameAr: 'الرياضيات',
          nameFr: 'Mathématiques',
          nameEn: 'Mathematics',
          streamId,
          coefficient: 2,
          icon: 'Calculator',
          color: '#7C3AED',
          confidence: 65,
          targetScore: 14,
          chapters: []
        }
      ];

    case 'langues_etrangeres':
      return [
        {
          id: 'lang_arabe',
          nameAr: 'اللغة العربية وآدابها',
          nameFr: 'Langue Arabe',
          nameEn: 'Arabic Literature',
          streamId: 'langues_etrangeres',
          coefficient: 5,
          icon: 'BookOpen',
          color: '#EC4899',
          confidence: 80,
          targetScore: 16,
          chapters: []
        },
        {
          id: 'lang_fr',
          nameAr: 'اللغة الفرنسية',
          nameFr: 'Français',
          nameEn: 'French',
          streamId: 'langues_etrangeres',
          coefficient: 5,
          icon: 'Languages',
          color: '#3B82F6',
          confidence: 75,
          targetScore: 16,
          chapters: []
        },
        {
          id: 'lang_en',
          nameAr: 'اللغة الإنجليزية',
          nameFr: 'Anglais',
          nameEn: 'English',
          streamId: 'langues_etrangeres',
          coefficient: 5,
          icon: 'Globe2',
          color: '#6366F1',
          confidence: 80,
          targetScore: 17,
          chapters: []
        },
        {
          id: 'lang_third',
          nameAr: 'اللغة الأجنبية الثالثة (إسبانية / ألمانية / إيطالية)',
          nameFr: '3ème Langue (Espagnol/Allemand/Italien)',
          nameEn: 'Third Language',
          streamId: 'langues_etrangeres',
          coefficient: 5,
          icon: 'Sparkles',
          color: '#10B981',
          confidence: 70,
          targetScore: 16.5,
          chapters: []
        },
        {
          id: 'lang_philo',
          nameAr: 'الفلسفة',
          nameFr: 'Philosophie',
          nameEn: 'Philosophy',
          streamId: 'langues_etrangeres',
          coefficient: 2,
          icon: 'Brain',
          color: '#F59E0B',
          confidence: 60,
          targetScore: 14,
          chapters: []
        },
        {
          id: 'lang_hg',
          nameAr: 'التاريخ والجغرافيا',
          nameFr: 'Histoire-Géo',
          nameEn: 'History-Geo',
          streamId: 'langues_etrangeres',
          coefficient: 2,
          icon: 'Globe',
          color: '#E11D48',
          confidence: 75,
          targetScore: 16,
          chapters: []
        },
        {
          id: 'lang_isl',
          nameAr: 'العلوم الإسلامية',
          nameFr: 'Sciences Islamiques',
          nameEn: 'Islamic Sciences',
          streamId: 'langues_etrangeres',
          coefficient: 2,
          icon: 'Moon',
          color: '#059669',
          confidence: 85,
          targetScore: 18,
          chapters: []
        },
        {
          id: 'lang_math',
          nameAr: 'الرياضيات',
          nameFr: 'Mathématiques',
          nameEn: 'Mathematics',
          streamId: 'langues_etrangeres',
          coefficient: 2,
          icon: 'Calculator',
          color: '#7C3AED',
          confidence: 65,
          targetScore: 14,
          chapters: []
        }
      ];
    }
  })();

  return subjects.map(subject => ({
    ...subject,
    confidence: 0,
    targetScore: undefined,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.map(topic => ({
        ...topic,
        status: 'not_started' as const,
        difficulty: 3 as const,
        isDifficult: false,
        lastRevisedDate: undefined
      }))
    }))
  }));
}
