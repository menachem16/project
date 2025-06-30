import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface AudioSystemProps {
  enabled: boolean;
}

export interface AudioSystemRef {
  playAlert: (type: string) => void;
  playAmbient: (type: string) => void;
  stopAll: () => void;
}

export const AudioSystem = forwardRef<AudioSystemRef, AudioSystemProps>(({ enabled }, ref) => {
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const hebrewMessages = {
    // Threat alerts
    threat_detected: 'איום זוהה במרחב האווירי הישראלי, כל המערכות במוכנות',
    missile_incoming: 'טיל בליסטי מתקרב למטרה, הפעלת מערכות יירוט',
    rocket_barrage: 'מטח רקטות זוהה, כיפת ברזל פעילה',
    drone_infiltration: 'חדירת כטבמים עוינים, מערכות הגנה פעילות',
    cyber_attack: 'התקפת סייבר מתבצעת, הפעלת פרוטוקולי הגנה',
    
    // Defense responses
    iron_dome_activated: 'כיפת ברזל הופעלה בהצלחה',
    arrow_intercept: 'חץ שלוש מיירט בהצלחה',
    david_sling_ready: 'קלע דוד במוכנות מלאה',
    successful_intercept: 'יירוט מוצלח, איום חוסל',
    target_eliminated: 'מטרה חוסלה בהצלחה',
    
    // Military operations
    missile_launched: 'טיל שוגר לעבר המטרה, זמן טיסה מוערך',
    operation_commenced: 'המבצע החל, כל הכוחות פעילים',
    forces_deployed: 'כוחות נפרסו בשטח',
    air_strike_initiated: 'תקיפה אווירית החלה',
    special_forces_active: 'כוחות מיוחדים פעילים בשטח',
    
    // Intelligence
    intelligence_gathered: 'מידע מודיעיני נאסף בהצלחה',
    surveillance_active: 'מעקב פעיל על מטרות',
    enemy_movement_detected: 'תנועת אויב זוהתה',
    
    // Diplomatic
    diplomatic_contact: 'יצירת קשר דיפלומטי',
    alliance_formed: 'ברית חדשה נוצרה',
    sanctions_imposed: 'סנקציות הוטלו',
    
    // Economic
    economic_boost: 'חיזוק כלכלי מתבצע',
    trade_agreement: 'הסכם סחר נחתם בהצלחה',
    infrastructure_investment: 'השקעה בתשתיות מתבצעת',
    
    // Emergency situations
    red_alert: 'אזעקה אדומה, פנו למרחב מוגן',
    all_clear: 'הסרת אזעקה, חזרה לשגרה',
    emergency_protocol: 'פרוטוקול חירום הופעל',
    evacuation_order: 'פקודת פינוי הוצאה',
    
    // Victory/Defeat
    mission_accomplished: 'המשימה הושלמה בהצלחה מלאה',
    operation_failed: 'המבצע נכשל, בחינת חלופות',
    strategic_victory: 'ניצחון אסטרטגי הושג',
    
    // System status
    systems_online: 'כל המערכות פעילות ומוכנות',
    defense_ready: 'מערכות הגנה מוכנות לפעולה',
    command_center_active: 'מרכז הפיקוד פעיל ומוכן'
  };

  const playAlert = (type: string) => {
    if (!enabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    if (currentUtterance.current) {
      speechSynthesis.cancel();
    }

    const hebrewMessage = hebrewMessages[type as keyof typeof hebrewMessages];
    
    if (hebrewMessage) {
      const utterance = new SpeechSynthesisUtterance(hebrewMessage);
      utterance.lang = 'he-IL';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      // Add urgency for critical alerts
      if (['threat_detected', 'missile_incoming', 'red_alert', 'cyber_attack'].includes(type)) {
        utterance.rate = 1.2;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
      }
      
      // Lower urgency for success messages
      if (['successful_intercept', 'target_eliminated', 'mission_accomplished'].includes(type)) {
        utterance.rate = 0.9;
        utterance.pitch = 0.9;
        utterance.volume = 0.8;
      }
      
      currentUtterance.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const playAmbient = (type: string) => {
    if (!enabled) return;
    
    try {
      // Create ambient sound effects using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      switch (type) {
        case 'radar_sweep':
          // Create radar sweep sound
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
          
        case 'alert_beep':
          // Create alert beep
          const beepOsc = audioContext.createOscillator();
          const beepGain = audioContext.createGain();
          
          beepOsc.connect(beepGain);
          beepGain.connect(audioContext.destination);
          
          beepOsc.frequency.setValueAtTime(1200, audioContext.currentTime);
          beepGain.gain.setValueAtTime(0.3, audioContext.currentTime);
          beepGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          beepOsc.start(audioContext.currentTime);
          beepOsc.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'missile_launch':
          // Create missile launch sound
          const launchOsc = audioContext.createOscillator();
          const launchGain = audioContext.createGain();
          
          launchOsc.connect(launchGain);
          launchGain.connect(audioContext.destination);
          
          launchOsc.frequency.setValueAtTime(200, audioContext.currentTime);
          launchOsc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1.0);
          
          launchGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          launchGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
          
          launchOsc.start(audioContext.currentTime);
          launchOsc.stop(audioContext.currentTime + 1.0);
          break;
      }
    } catch (error) {
      console.warn('Audio context error:', error);
    }
  };

  const stopAll = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    currentUtterance.current = null;
  };

  useImperativeHandle(ref, () => ({
    playAlert,
    playAmbient,
    stopAll
  }));

  return null;
});

AudioSystem.displayName = 'AudioSystem';