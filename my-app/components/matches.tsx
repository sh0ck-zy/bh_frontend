'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Star, Search, Home, Calendar, LogIn, ChevronDown, ChevronUp, Sun, Moon, Info, ChevronLeft, ChevronRight } from 'lucide-react'

// Types
type Sport = {
  name: string;
  emoji: string;
}

type League = {
  id: string;
  name: string;
  country: string;
  flag: string;
  logo: string;
}

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  startTime: string;
  league: League;
}

const sports: Sport[] = [
  { name: 'Football', emoji: '⚽' },
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Baseball', emoji: '⚾' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Ice Hockey', emoji: '🏒' },
]

const dummyLeagues: { [key: string]: League[] } = {
  Football: [
    { id: 'epl', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: '/premier-league.svg' },
    { id: 'laliga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', logo: '/la-liga.svg' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', logo: '/bundesliga.svg' },
    { id: 'seriea', name: 'Serie A', country: 'Italy', flag: '🇮🇹', logo: '/serie-a.svg' },
    { id: 'ligue1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', logo: '/ligue-1.svg' },
  ],
  Basketball: [
    { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸', logo: '/nba.svg' },
    { id: 'euroleague', name: 'EuroLeague', country: 'Europe', flag: '🇪🇺', logo: '/euroleague.svg' },
  ],
  Baseball: [
    { id: 'mlb', name: 'MLB', country: 'USA', flag: '🇺🇸', logo: '/mlb.svg' },
    { id: 'npb', name: 'Nippon Professional Baseball', country: 'Japan', flag: '🇯🇵', logo: '/npb.svg' },
  ],
  Tennis: [
    { id: 'atp', name: 'ATP Tour', country: 'Worldwide', flag: '🌍', logo: '/atp.svg' },
    { id: 'wta', name: 'WTA Tour', country: 'Worldwide', flag: '🌍', logo: '/wta.svg' },
  ],
  'Ice Hockey': [
    { id: 'nhl', name: 'NHL', country: 'USA/Canada', flag: '🇺🇸🇨🇦', logo: '/nhl.svg' },
    { id: 'khl', name: 'KHL', country: 'Russia', flag: '🇷🇺', logo: '/khl.svg' },
  ],
}

const generateDummyMatches = (league: League, date: Date): Match[] => {
  const teams = {
    'Premier League': ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Manchester City'],
    'La Liga': ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia'],
    'Bundesliga': ['Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Borussia Mönchengladbach'],
    'Serie A': ['Juventus', 'Inter Milan', 'AC Milan', 'Napoli', 'Roma'],
    'Ligue 1': ['Paris Saint-Germain', 'Lille', 'Lyon', 'Monaco', 'Marseille'],
    'NBA': ['Los Angeles Lakers', 'Brooklyn Nets', 'Golden State Warriors', 'Milwaukee Bucks', 'Phoenix Suns'],
    'MLB': ['New York Yankees', 'Los Angeles Dodgers', 'Boston Red Sox', 'Houston Astros', 'Chicago Cubs'],
    'ATP Tour': ['Novak Djokovic', 'Rafael Nadal', 'Roger Federer', 'Daniil Medvedev', 'Stefanos Tsitsipas'],
    'NHL': ['Tampa Bay Lightning', 'Colorado Avalanche', 'Vegas Golden Knights', 'Carolina Hurricanes', 'Toronto Maple Leafs'],
  }

  const leagueTeams = teams[league.name as keyof typeof teams] || ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']

  return Array.from({ length: 3 }, (_, i) => {
    const homeTeam = leagueTeams[i]
    const awayTeam = leagueTeams[(i + 1) % leagueTeams.length]
    const matchDate = new Date(date)
    matchDate.setHours(Math.floor(Math.random() * 12) + 12, 0, 0, 0)
    return {
      id: `${league.id}-${i + 1}-${date.toISOString().split('T')[0]}`,
      homeTeam,
      awayTeam,
      homeTeamLogo: `/placeholder.svg?height=20&width=20&text=${homeTeam.substring(0, 3).toUpperCase()}`,
      awayTeamLogo: `/placeholder.svg?height=20&width=20&text=${awayTeam.substring(0, 3).toUpperCase()}`,
      league,
      startTime: matchDate.toISOString(),
    }
  })
}

export function Matches() {
  const [selectedSport, setSelectedSport] = useState<Sport>(sports[0])
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [expandedLeagues, setExpandedLeagues] = useState<string[]>([])
  const [favoritedLeagues, setFavoritedLeagues] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const leagueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  useEffect(() => {
    const sportLeagues = dummyLeagues[selectedSport.name] || []
    const newMatches = sportLeagues.flatMap(league => generateDummyMatches(league, selectedDate))
    setMatches(newMatches)
    setExpandedLeagues(sportLeagues.map(league => league.id))
  }, [selectedSport, selectedDate])

  const toggleLeagueExpansion = (leagueId: string) => {
    setExpandedLeagues(prev =>
      prev.includes(leagueId)
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    )
  }

  const toggleLeagueFavorite = (leagueId: string) => {
    setFavoritedLeagues(prev =>
      prev.includes(leagueId)
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    )
  }

  const selectLeague = (league: League) => {
    setSelectedLeague(league)
    if (!expandedLeagues.includes(league.id)) {
      toggleLeagueExpansion(league.id)
    }
    setTimeout(() => {
      leagueRefs.current[league.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(156, 163, 175, 0.3)'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.5)'};
        }

        @keyframes shine {
          from {
            background-position: 200% center;
          }
          to {
            background-position: -200% center;
          }
        }

        .shine-button {
          background: linear-gradient(
            90deg, 
            #3b82f6 0%, 
            #60a5fa 25%, 
            #3b82f6 50%, 
            #60a5fa 75%, 
            #3b82f6 100%
          );
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }
      `}</style>

      <header className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="max-w-[2000px] mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-4">
            <img src="/placeholder.svg?height=30&width=30" alt="Bethub Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Bethub</h1>
          </Link>
          <nav className="flex space-x-4">
            <Link href="/" className={`px-3 py-2 rounded-full text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-200 hover:text-black'} transition-colors flex items-center space-x-2`}>
              <Calendar className="h-4 w-4" />
              <span>Matches</span>
            </Link>
            <Link href="/about" className={`px-3 py-2 rounded-full text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-200 hover:text-black'} transition-colors flex items-center space-x-2`}>
              <Info className="h-4 w-4" />
              <span>About Us</span>
            </Link>
            <Link href="#" className={`px-3 py-2 rounded-full text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-200 hover:text-black'} transition-colors flex items-center space-x-2`}>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-200 hover:text-black'} transition-colors`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-grow flex max-w-[2000px] mx-auto px-6">
        {/* Left column */}
        <div className="w-1/4 py-4 pr-4 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className={`w-full px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border border-gray-300'
              }`}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
            <h2 className="text-lg font-bold mb-2">Sports</h2>
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => (
                <button
                  key={sport.name}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSport.name === sport.name
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`
                  }`}
                >
                  {sport.emoji} {sport.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
            <h2 className="text-lg font-bold mb-2">Leagues</h2>
            <ul className="space-y-2">
              {(dummyLeagues[selectedSport.name] || []).map((league) => (
                <li key={league.id}>
                  <button
                    onClick={() => selectLeague(league)}
                    className={`w-full text-left px-3  py-2 rounded-lg ${
                      selectedLeague?.id === league.id
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                        : `${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`
                    } flex justify-between items-center`}
                  >
                    <div className="flex items-center">
                      <img src={league.logo} alt={league.name} className="w-5 h-5 inline-block mr-2" />
                      {league.name}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLeagueFavorite(league.id)
                      }}
                      className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                    >
                      <Star className={`h-5 w-5 ${favoritedLeagues.includes(league.id) ? 'text-yellow-500' : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}`} />
                    </button>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
            <h2 className="text-lg font-bold mb-2">Advertisement</h2>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} h-40 flex items-center justify-center rounded-lg`}>
              Ad Space
            </div>
          </div>
        </div>

        {/* Middle column */}
        <div className="w-1/2 py-4 px-6">
          <div className="sticky top-20 bg-inherit pb-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Matches</h2>
              <div className="flex items-center space-x-2">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-sm px-3 py-1 rounded-full`}>
                  ALL
                </button>
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-sm px-3 py-1 rounded-full flex items-center space-x-1`}>
                  <span className="text-red-500">🔴</span>
                  <span>LIVE (21)</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-sm px-3 py-1 rounded-full flex items-center space-x-1`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </button>
                  {showDatePicker && (
                    <div className={`absolute right-0 mt-2 p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
                      <div className="flex space-x-2">
                        <button onClick={() => changeDate(-1)}><ChevronLeft className="h-4 w-4" /></button>
                        <span>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <button onClick={() => changeDate(1)}><ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`h-px w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>
          
          <div className="space-y-4 mt-6">
            {(dummyLeagues[selectedSport.name] || []).map((league) => (
              <div key={league.id} ref={el => leagueRefs.current[league.id] = el}
                   className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-lg overflow-hidden`}>
                <button
                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                  onClick={() => toggleLeagueExpansion(league.id)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedLeagues.includes(league.id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    <h3 className="text-lg font-bold">{league.name}</h3>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{league.country} {league.flag}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLeagueFavorite(league.id)
                    }}
                    className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                  >
                    <Star className={`h-5 w-5 ${favoritedLeagues.includes(league.id) ? 'text-yellow-500' : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}`} />
                  </button>
                </button>
                {expandedLeagues.includes(league.id) && (
                  <div className={`${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-y pt-2`}>
                    {matches
                      .filter((match) => match.league && match.league.id === league.id)
                      .map((match) => (
                        <div key={match.id} className="p-4">
                          <button
                            onClick={() => setSelectedMatch(match)}
                            className={`w-full text-left rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors flex items-center p-3`}
                          >
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} w-16 text-sm`}>
                              {formatMatchTime(match.startTime)}
                            </span>
                            <div className="flex-grow">
                              <div className="flex items-center space-x-2">
                                <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-5 h-5" />
                                <span>{match.homeTeam}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-5 h-5" />
                                <span>{match.awayTeam}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMatch(match);
                                }}
                              >
                                <span role="img" aria-label="View match details" className="text-lg">👁️</span>
                                <span className="text-xs">Details</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add logic to favorite the match
                                }}
                                className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-300'}`}
                              >
                                <Star className={`h-5 w-5 ${isDarkMode ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`} />
                              </button>
                            </div>
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="w-1/4 py-4 pl-4 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          {selectedMatch ? (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold">{selectedMatch.league?.name || 'Unknown League'}</h2>
                  <button onClick={() => selectedMatch.league && toggleLeagueFavorite(selectedMatch.league.id)}>
                    <Star className={`h-5 w-5 ${selectedMatch.league && favoritedLeagues.includes(selectedMatch.league.id) ? 'text-yellow-500' : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}`} />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <img src={selectedMatch.homeTeamLogo} alt={selectedMatch.homeTeam} className="w-6 h-6" />
                  <span className="font-bold">{selectedMatch.homeTeam}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={selectedMatch.awayTeamLogo} alt={selectedMatch.awayTeam} className="w-6 h-6" />
                  <span className="font-bold">{selectedMatch.awayTeam}</span>
                </div>
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
                {formatMatchTime(selectedMatch.startTime)}
              </p>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg mb-4`}>
                <h3 className="font-bold mb-2">Match Preview</h3>
                <p className={`${isDarkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-700'}`}>
                  A brief preview of the match will be displayed here. This is a teaser for the full analysis.
                </p>
              </div>
              <button 
                onClick={() => setShowAIAnalysis(true)}
                className="w-full text-white font-bold py-2 px-4 rounded-lg relative overflow-hidden shine-button"
              >
                <span className="relative z-10">View AI Analysis 🧠</span>
              </button>
            </div>
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
              <p className="text-center text-gray-500">Select a match to view details</p>
            </div>
          )}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} mt-6 p-4 rounded-lg`}>
            <h2 className="text-lg font-bold mb-2">Advertisement</h2>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} h-40 flex items-center justify-center rounded-lg`}>
              Ad Space
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAIAnalysis && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAIAnalysis(false)} />
          <div 
            className={`relative w-3/4 max-w-4xl max-h-[80vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-700 bg-inherit">
              <h2 className="text-2xl font-bold">AI Analysis</h2>
              <button
                onClick={() => setShowAIAnalysis(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={selectedMatch.homeTeamLogo} alt={selectedMatch.homeTeam} className="w-12 h-12" />
                    <span className="text-2xl font-bold">VS</span>
                    <img src={selectedMatch.awayTeamLogo} alt={selectedMatch.awayTeam} className="w-12 h-12" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatMatchTime(selectedMatch.startTime)}
                    </p>
                  </div>
                </div>
                
                <div className={`${isDarkMode ?  'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">Key Statistics</h3>
                  <ul className="list-disc list-inside">
                    <li>Home team win rate: 60%</li>
                    <li>Away team recent form: WWDLW</li>
                    <li>Average goals per game: 2.5</li>
                  </ul>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">Expected Value (EV) for Bets</h3>
                  <p>Based on our AI analysis, the following bets have positive EV:</p>
                  <ul className="list-disc list-inside">
                    <li>Home team to win: +120 (EV: +2.5%)</li>
                    <li>Over 2.5 goals: -110 (EV: +1.8%)</li>
                  </ul>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">Risk-Return Analysis</h3>
                  <p>Low risk: Home team to score (75% probability)</p>
                  <p>Medium risk: Exact score 2-1 (15% probability)</p>
                  <p>High risk: Away team to win by 2+ goals (5% probability)</p>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">AI-Generated Insights</h3>
                  <p>Our AI model predicts a close match with a slight edge to the home team. Key factors include recent form, head-to-head history, and current team injuries.</p>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">Betting Tips</h3>
                  <ul className="list-disc list-inside">
                    <li>Consider a small stake on the home team to win</li>
                    <li>The over 2.5 goals market looks promising</li>
                    <li>Avoid the exact score market due to high variance</li>
                  </ul>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <h3 className="text-lg font-bold mb-2">Odds Comparison</h3>
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th>Bookmaker</th>
                        <th>Home</th>
                        <th>Draw</th>
                        <th>Away</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bookmaker A</td>
                        <td>2.00</td>
                        <td>3.40</td>
                        <td>3.75</td>
                      </tr>
                      <tr>
                        <td>Bookmaker B</td>
                        <td>1.95</td>
                        <td>3.50</td>
                        <td>3.80</td>
                      </tr>
                      <tr>
                        <td>Bookmaker C</td>
                        <td>2.05</td>
                        <td>3.30</td>
                        <td>3.70</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={`py-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <p className="text-sm">&copy; 2024 Bethub. All rights reserved.</p>
            </div>
            <nav className="w-full md:w-auto">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
                <li><Link href="#" className={`${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-500'} text-sm transition-colors`}>Terms</Link></li>
                <li><Link href="#" className={`${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-500'} text-sm transition-colors`}>Privacy</Link></li>
                <li><Link href="#" className={`${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-500'} text-sm transition-colors`}>Cookies</Link></li>
                <li><Link href="#" className={`${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-500'} text-sm transition-colors`}>Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}