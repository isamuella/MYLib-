import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { MdSelfImprovement, MdLibraryBooks } from 'react-icons/md';
import './MentalHealth.css';


// Add built-in fallback resources (French) used when API returns nothing or on error
const fallbackResources = [
  {
    id: 'ex-1',
    type: 'exercise',
    title: 'Respiration consciente (avec bulles)',
    description: 'Pratique simple pour calmer le corps et l’esprit en utilisant la respiration et une activité ludique.',
    content:
      "Asseyez-vous confortablement. Inspirez lentement par le nez en comptant jusqu'à 4, retenez 1, puis soufflez en faisant des bulles ou en imaginant souffler une bougie en comptant jusqu'à 6. Répétez 6 à 10 fois. Concentrez-vous sur la sensation de l’air qui entre et sort. Cette activité combine la respiration consciente et un geste doux pour apaiser le système nerveux.",
  },
  {
    id: 'ex-2',
    type: 'exercise',
    title: 'Ancrage 5-4-3-2-1',
    description: "Technique de grounding pour ramener l’attention au présent à l’aide des sens.",
    content:
      "Regardez autour de vous et nommez 5 choses que vous voyez. Touchez 4 objets et notez leurs textures. Écoutez et identifiez 3 sons. Sentez 2 odeurs ou notez deux choses que vous pourriez sentir. Dégustez ou imaginez 1 goût. Respirez profondément entre chaque étape. Cette méthode aide à réduire l’anxiété en ancrant l’attention sur l’instant présent.",
  },
  {
    id: 'ex-3',
    type: 'exercise',
    title: 'Expression par le dessin',
    description: "Exprimez vos émotions sans mots — utile pour enfants et adultes.",
    content:
      "Prenez du papier et des crayons. Dessinez ce que vous ressentez en couleurs, formes ou symboles, sans chercher à être parfait. Après 10–15 minutes, observez le dessin : quelles émotions apparaissent ? Cela permet d’extérioriser et de mieux comprendre ses ressentis.",
  },
  {
    id: 'ex-4',
    type: 'exercise',
    title: 'Bocal de gratitude',
    description: "Petit rituel pour cultiver la gratitude et le bien-être au quotidien.",
    content:
      "Chaque jour, notez une petite chose positive sur un papier et mettez-la dans un bocal. Quand vous vous sentez triste ou stressé, ouvrez quelques papiers et relisez-les. Ce geste renforce la vision positive et aide à reconnaître les ressources personnelles.",
  },
  {
    id: 'ex-5',
    type: 'exercise',
    title: 'Affirmations « Je suis »',
    description: "Renforce l’estime et la confiance par des énoncés positifs.",
    content:
      "Devant un miroir, dites à voix haute 3 affirmations commençant par « Je suis… » (par ex. « Je suis capable », « Je suis digne d’écoute », « Je suis en sécurité »). Répétez chaque affirmation lentement 3 fois. Vous pouvez les écrire et les garder sur un papier visible.",
  },
  {
    id: 'story-1',
    type: 'story',
    title: 'L’histoire de la petite bulle',
    description: "Une courte histoire pour aider à comprendre la respiration consciente.",
    content:
      "Il était une fois une petite bulle qui voyageait doucement dans l’air. Quand elle grandissait, elle inspirait calme et lumière ; quand elle rétrécissait, elle emportait avec elle les nuages sombres. Chaque fois que le vent soufflait trop fort, la bulle apprenait à respirer plus lentement et retrouvait son chemin. La bulle rappelle que prendre une respiration lente nous aide à retrouver notre calme.",
  },
  {
    id: 'story-2',
    type: 'story',
    title: 'Le jardin des 5 sens',
    description: "Conte court pour pratiquer l’ancrage sensoriel.",
    content:
      "Dans un jardin, un enfant explore cinq chemins: un sentier coloré (vue), un tapis rugueux (toucher), une fontaine qui chante (son), un coin de fleurs parfumées (odorat) et une boîte de biscuits (goût). En visitant chacun, l’enfant apprend à revenir au présent et à se sentir en sécurité dans son corps. Ce jardin symbolise comment nos sens nous reconnectent à l’instant.",
  },
  {
    id: 'story-3',
    type: 'story',
    title: 'La boîte à dessins magique',
    description: "Histoire encourageant l’expression des émotions par l’art.",
    content:
      "Une boîte à dessins magique transformait chaque trait en couleur d’émotion. Quand un enfant dessinait sa colère, la couleur devenait lumière et se calmait. En dessinant la joie, la pièce s’illuminait. La boîte rappelle que mettre des émotions sur papier les rend plus faciles à comprendre et à partager.",
  },
];

const MentalHealth = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (selectedType) params.type = selectedType;

        const response = await axios.get(`${API_URL}/mental-health`, { params });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setResources(response.data);
        } else {
          setResources(getFallback(selectedType));
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Impossible de charger les ressources. Réessayez plus tard.');
        
        setResources(getFallback(selectedType));
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedType]);

  const getFallback = (type) => {
    if (!type) return fallbackResources;
    return fallbackResources.filter((r) => r.type === type);
  };
 

  return (
    <div className="mental-health-page">
      <div className="container">
        <div className="page-header">
          <h1>Santé Mentale</h1>
          <p>Ressources pour votre bien-être émotionnel et mental</p>
        </div>
        {error && <div className="alert error-alert">{error}</div>}

        <div className="categories">
          <button
            className={`category-btn ${selectedType === '' ? 'active' : ''}`}
            onClick={() => setSelectedType('')}
          >
            Tous
          </button>
          <button
            className={`category-btn ${selectedType === 'exercise' ? 'active' : ''}`}
            onClick={() => setSelectedType('exercise')}
          >
            Exercices
          </button>
          <button
            className={`category-btn ${selectedType === 'story' ? 'active' : ''}`}
            onClick={() => setSelectedType('story')}
          >
            Histoires
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : resources.length === 0 ? (
          <div className="no-resources">
            <p>Aucune ressource disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid">
            {resources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="resource-icon">
                  {resource.type === 'exercise' ? (
                    <MdSelfImprovement size={36} />
                  ) : (
                    <MdLibraryBooks size={36} />
                  )}
                </div>
                <h3>{resource.title}</h3>
                {resource.description && (
                  <p className="resource-description">{resource.description}</p>
                )}
                {resource.content && (
                  <div className="resource-content">
                    <p>{resource.content}</p>
                  </div>
                )}
                {resource.file_url && (
                  <a
                    href={`${API_URL.replace('/api', '')}${resource.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Voir la ressource
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="info-section">
          <div className="card">
            <h2>Pourquoi la santé mentale est importante</h2>
            <p>
              La santé mentale est essentielle pour votre bien-être global. 
              Ces ressources vous aident à comprendre vos émotions, à gérer le stress, 
              et à développer des compétences pour faire face aux défis quotidiens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;

