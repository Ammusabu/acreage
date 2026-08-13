'use client';

import { useState } from 'react';
import { Search, X, MapPin, Calendar, Users, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const destinations = [
  { name: 'New York City', country: 'United States', type: 'The Big Apple', icon: '🗽' },
  { name: 'Los Angeles', country: 'United States', type: 'Entertainment capital', icon: '🎬' },
  { name: 'Miami', country: 'United States', type: 'Beach paradise', icon: '🏖️' },
  { name: 'Chandigarh', country: 'India', type: 'The City Beautiful', icon: '🏛️' },
  { name: 'Jaipur', country: 'India', type: 'Pink City', icon: '🏰' },
  { name: 'Goa', country: 'India', type: 'Beach destination', icon: '🏖️' },
  { name: 'London', country: 'United Kingdom', type: 'Historic capital', icon: '🏰' },
  { name: 'Paris', country: 'France', type: 'City of Love', icon: '🗼' },
  { name: 'Tokyo', country: 'Japan', type: 'Modern metropolis', icon: '🗼' },
  { name: 'Rome', country: 'Italy', type: 'Eternal City', icon: '🏛️' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [step, setStep] = useState<'where' | 'when' | 'who'>('where');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('location', searchQuery);
    if (checkIn) params.append('check_in', checkIn.toISOString().split('T')[0]);
    if (checkOut) params.append('check_out', checkOut.toISOString().split('T')[0]);
    const totalGuests = adults + children;
    if (totalGuests > 0) params.append('guests', totalGuests.toString());
    
    window.location.href = `/search?${params.toString()}`;
    onClose();
  };

  const getDaysInMonth = (year: number, month: number) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateSelected = (date: Date) => {
    if (checkIn && date.toDateString() === checkIn.toDateString()) return 'check-in';
    if (checkOut && date.toDateString() === checkOut.toDateString()) return 'check-out';
    if (checkIn && checkOut && date > checkIn && date < checkOut) return 'between';
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (date < checkIn) {
      setCheckIn(date);
    } else {
      setCheckOut(date);
    }
  };

  const totalGuests = adults + children + infants + pets;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const renderMonth = (monthOffset: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const days = getDaysInMonth(year, month);
    const monthName = months[month % 12];
    const displayYear = year + Math.floor(month / 12);

    return (
      <div>
        <div className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
          {monthName} {displayYear}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 py-1">
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            const selected = isDateSelected(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            
            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateClick(date)}
                disabled={isPast}
                className={`
                  relative aspect-square rounded-full text-sm font-medium transition
                  ${isPast ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-[#FF385C]/10'}
                  ${selected === 'check-in' ? 'bg-[#FF385C] text-white hover:bg-[#D70466]' : ''}
                  ${selected === 'check-out' ? 'bg-[#FF385C] text-white hover:bg-[#D70466]' : ''}
                  ${selected === 'between' ? 'bg-[#FF385C]/20 text-[#FF385C]' : ''}
                  ${isToday && !selected ? 'border border-[#FF385C]' : ''}
                `}
              >
                {date.getDate()}
                {selected === 'check-in' && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF385C] rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 flex-1">
                {step !== 'where' && (
                  <button
                    onClick={() => setStep('where')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="flex items-center gap-2 flex-1">
                  <div className={`flex-1 ${step === 'where' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Where</div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#FF385C]" />
                      <input
                        type="text"
                        placeholder="Search destinations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        autoFocus={step === 'where'}
                        onFocus={() => setStep('where')}
                      />
                    </div>
                  </div>
                  <div className={`flex-1 ${step === 'when' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">When</div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#FF385C]" />
                      <div 
                        className="text-sm text-gray-900 dark:text-white cursor-pointer"
                        onClick={() => setStep('when')}
                      >
                        {checkIn ? `${checkIn.toLocaleDateString()} - ${checkOut ? checkOut.toLocaleDateString() : '...'}` : 'Add dates'}
                      </div>
                    </div>
                  </div>
                  <div className={`flex-1 ${step === 'who' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Who</div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#FF385C]" />
                      <div 
                        className="text-sm text-gray-900 dark:text-white cursor-pointer"
                        onClick={() => setStep('who')}
                      >
                        {totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] p-6">
              {step === 'where' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Popular destinations</h3>
                    <div className="space-y-2">
                      {filteredDestinations.map((dest, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(dest.name);
                            setStep('when');
                          }}
                          className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition text-left"
                        >
                          <span className="text-2xl">{dest.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{dest.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{dest.country} · {dest.type}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'when' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dates</h3>
                    <button className="text-sm text-[#FF385C] font-medium hover:underline">Flexible</button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderMonth(0)}
                    {renderMonth(1)}
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setStep('who')}
                      className="px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 'who' && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Adults</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setAdults(Math.max(0, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Children</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Infants</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Under 2</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{infants}</span>
                      <button
                        onClick={() => setInfants(infants + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Pets</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Bringing a service animal?</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setPets(Math.max(0, pets - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{pets}</span>
                      <button
                        onClick={() => setPets(pets + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full py-3 bg-[#FF385C] text-white rounded-xl hover:bg-[#D70466] transition font-medium text-lg shadow-md hover:shadow-lg"
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
