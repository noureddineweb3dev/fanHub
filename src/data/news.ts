import { NewsArticle } from '@/lib/types/news';

export const news: NewsArticle[] = [
  {
    id: 'news-1',
    teamId: 'morocco',
    title: 'Morocco Defeats Algeria 2-0 in Thrilling Friendly',
    excerpt:
      'The Atlas Lions showcased their dominance with goals from Hakimi and En-Nesyri in a convincing victory over their North African rivals.',
    category: 'match',
    source: 'ESPN',
    publishedAt: '2026-01-14T22:30:00Z',
  },
  {
    id: 'news-2',
    teamId: 'morocco',
    title: 'Ziyech Returns to National Team Squad',
    excerpt:
      'Hakim Ziyech has been called up to the Morocco squad for upcoming AFCON matches after impressive form with Galatasaray.',
    category: 'general',
    source: 'FIFA.com',
    publishedAt: '2026-01-13T10:00:00Z',
  },
  {
    id: 'news-3',
    teamId: 'morocco',
    title: 'Bounou Recovers from Shoulder Injury',
    excerpt:
      'Morocco goalkeeper Yassine Bounou has fully recovered from his shoulder injury and is expected to start against Egypt.',
    category: 'injury',
    source: 'CAF Online',
    publishedAt: '2026-01-12T15:00:00Z',
  },
  {
    id: 'news-4',
    teamId: 'morocco',
    title: 'Coach Regragui Extends Contract Until 2027',
    excerpt:
      'Morocco has secured the services of head coach Walid Regragui with a contract extension through 2027.',
    category: 'general',
    source: 'BBC Sport',
    publishedAt: '2026-01-08T12:00:00Z',
  },
  {
    id: 'news-5',
    teamId: 'brazil',
    title: 'Vinícius Júnior Shines in Training Camp',
    excerpt:
      'Real Madrid star impresses national team coaching staff ahead of crucial World Cup qualifier against Argentina.',
    category: 'general',
    source: 'CBF Official',
    publishedAt: '2026-01-13T14:00:00Z',
  },
  {
    id: 'news-6',
    teamId: 'brazil',
    title: 'Neymar Returns After Long Injury Layoff',
    excerpt:
      'Brazilian forward Neymar Jr makes his comeback to the national team after recovering from ACL injury sustained in 2023.',
    category: 'injury',
    source: 'Goal.com',
    publishedAt: '2026-01-10T16:30:00Z',
  },
  {
    id: 'news-7',
    teamId: 'barcelona',
    title: 'Barcelona Eyes Summer Transfer Targets',
    excerpt:
      'Club directors have identified several key positions to strengthen the squad for the upcoming season.',
    category: 'transfer',
    source: 'Marca',
    publishedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: 'news-8',
    teamId: 'barcelona',
    title: 'Lewandowski Reaches 90-Goal Milestone',
    excerpt:
      'Polish striker Robert Lewandowski scores his 90th goal for Barcelona in draw against Atletico Madrid.',
    category: 'match',
    source: 'AS',
    publishedAt: '2026-01-12T18:00:00Z',
  },
  {
    id: 'news-9',
    teamId: 'manchester-united',
    title: 'Manchester Derby Set for Old Trafford Showdown',
    excerpt:
      'United prepares to host Manchester City in crucial Premier League clash that could decide top-four race.',
    category: 'match',
    source: 'Sky Sports',
    publishedAt: '2026-01-14T11:00:00Z',
  },
];

export function getNewsByTeam(teamId: string): NewsArticle[] {
  return news
    .filter((article) => article.teamId === teamId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getNewsByCategory(
  teamId: string,
  category: NewsArticle['category']
): NewsArticle[] {
  return news
    .filter((article) => article.teamId === teamId && article.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
