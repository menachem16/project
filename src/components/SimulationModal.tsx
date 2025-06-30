import React, { useState, useEffect } from 'react';
import { X, Target, Users, MessageSquare, Zap, DollarSign, Shield } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: any;
  onComplete: (result: any) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  simulation,
  onComplete
}) => {
  const [phase, setPhase] = useState<'preparation' | 'execution' | 'result'>('preparation');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && simulation) {
      setPhase('preparation');
      setProgress(0);
      setResult(null);
    }
  }, [isOpen, simulation]);

  const executeSimulation = () => {
    setPhase('execution');
    
    // Simulate execution with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const simulationResult = generateResult();
            setResult(simulationResult);
            setPhase('result');
            onComplete(simulationResult);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const generateResult = () => {
    const success = Math.random() > 0.3; // 70% success rate
    
    switch (simulation.type) {
      case 'missile_attack':
        return {
          success,
          casualties: success ? Math.floor(Math.random() * 1000) + 100 : 0,
          infrastructureDamage: success ? Math.floor(Math.random() * 50) + 10 : 0,
          internationalReaction: success ? 'Severe condemnation' : 'Relief at failed attack',
          economicImpact: success ? -5 : -1
        };
      
      case 'diplomatic_meeting':
        return {
          success,
          agreementReached: success,
          relationshipChange: success ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 10) - 5,
          tradeDeals: success ? Math.floor(Math.random() * 3) + 1 : 0,
          mediaReaction: success ? 'Positive coverage' : 'Talks stalled'
        };
      
      case 'cyber_attack':
        return {
          success,
          systemsCompromised: success ? Math.floor(Math.random() * 5) + 1 : 0,
          dataStolen: success ? 'Classified intelligence obtained' : 'Attack detected and blocked',
          attribution: Math.random() > 0.6 ? 'Traced back to source' : 'Anonymous attack',
          economicDamage: success ? Math.floor(Math.random() * 10) + 5 : 0
        };
      
      case 'troop_movement':
        return {
          success,
          unitsDeployed: success ? Math.floor(Math.random() * 5000) + 1000 : 0,
          strategicAdvantage: success ? 'Positions secured' : 'Movement detected',
          internationalResponse: success ? 'Monitoring situation' : 'Calls for de-escalation',
          moralImpact: success ? 5 : -2
        };
      
      default:
        return { success, message: 'Operation completed' };
    }
  };

  const getSimulationIcon = () => {
    switch (simulation?.type) {
      case 'missile_attack': return <Target className="w-8 h-8 text-red-400" />;
      case 'troop_movement': return <Users className="w-8 h-8 text-green-400" />;
      case 'diplomatic_meeting': return <MessageSquare className="w-8 h-8 text-blue-400" />;
      case 'cyber_attack': return <Zap className="w-8 h-8 text-purple-400" />;
      case 'trade_route': return <DollarSign className="w-8 h-8 text-yellow-400" />;
      default: return <Shield className="w-8 h-8 text-gray-400" />;
    }
  };

  const getSimulationTitle = () => {
    switch (simulation?.type) {
      case 'missile_attack': return 'Missile Strike Operation';
      case 'troop_movement': return 'Military Deployment';
      case 'diplomatic_meeting': return 'Diplomatic Summit';
      case 'cyber_attack': return 'Cyber Warfare Operation';
      case 'trade_route': return 'Trade Agreement';
      default: return 'Military Operation';
    }
  };

  if (!isOpen || !simulation) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getSimulationIcon()}
            <h2 className="text-2xl font-bold text-white">{getSimulationTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-3">Operation Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">From:</span>
                  <span className="text-white ml-2">{simulation.fromName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white ml-2">{simulation.toName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2 capitalize">{simulation.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Risk Level:</span>
                  <span className={`ml-2 font-bold ${
                    simulation.riskLevel === 'high' ? 'text-red-400' :
                    simulation.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {simulation.riskLevel?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-3">Expected Outcomes</h3>
              <div className="space-y-2 text-sm text-gray-300">
                {simulation.type === 'missile_attack' && (
                  <>
                    <div>• Military infrastructure damage</div>
                    <div>• Potential civilian casualties</div>
                    <div>• International condemnation</div>
                    <div>• Escalation of regional tensions</div>
                  </>
                )}
                {simulation.type === 'diplomatic_meeting' && (
                  <>
                    <div>• Improved bilateral relations</div>
                    <div>• Potential trade agreements</div>
                    <div>• Regional stability enhancement</div>
                    <div>• Media attention and coverage</div>
                  </>
                )}
                {simulation.type === 'cyber_attack' && (
                  <>
                    <div>• Intelligence gathering</div>
                    <div>• Infrastructure disruption</div>
                    <div>• Plausible deniability</div>
                    <div>• Risk of attribution</div>
                  </>
                )}
                {simulation.type === 'troop_movement' && (
                  <>
                    <div>• Strategic positioning</div>
                    <div>• Show of force</div>
                    <div>• Deterrent effect</div>
                    <div>• International monitoring</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={executeSimulation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Execute Operation
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {phase === 'execution' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Operation in Progress</h3>
              <p className="text-gray-400">Executing {getSimulationTitle().toLowerCase()}...</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-bold text-white mb-2">Live Updates</h4>
              <div className="space-y-1 text-sm text-gray-300">
                {progress > 20 && <div>• Operation initiated</div>}
                {progress > 40 && <div>• Assets deployed</div>}
                {progress > 60 && <div>• Target acquired</div>}
                {progress > 80 && <div>• Execution phase</div>}
                {progress >= 100 && <div>• Operation completed</div>}
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl mb-4 ${result.success ? '✅' : '❌'}`}>
                {result.success ? '✅' : '❌'}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                Operation {result.success ? 'Successful' : 'Failed'}
              </h3>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-bold text-white mb-3">Operation Results</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(result).map(([key, value]) => {
                  if (key === 'success') return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="text-white">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};