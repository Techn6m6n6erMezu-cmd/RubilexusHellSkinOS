import { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, ToggleLeft, ToggleRight, Brain } from 'lucide-react';
import {
  getBehaviorRules,
  createBehaviorRule,
  toggleBehaviorRule,
  deleteBehaviorRule,
  type BehaviorRule,
} from '../services/districtService';

const CONDITION_FIELDS = ['mood', 'energy'];
const CONDITION_OPERATORS = [
  { value: 'lt', label: '< less than' },
  { value: 'gt', label: '> greater than' },
  { value: 'eq', label: '= equals' },
];
const ACTION_TYPES = ['set_activity', 'set_location', 'go_to', 'trigger'];
const PRIORITY_LABELS: Record<number, string> = {
  10: 'CRITICAL',
  9: 'HIGH',
  8: 'HIGH',
  7: 'MEDIUM',
  6: 'MEDIUM',
  5: 'NORMAL',
  4: 'LOW',
  3: 'LOW',
  2: 'MINIMAL',
  1: 'MINIMAL',
};

export default function BehaviorForge() {
  const [rules, setRules] = useState<BehaviorRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    rule_name: '',
    condition_field: 'energy',
    condition_operator: 'lt',
    condition_value: 30,
    action_type: 'set_activity',
    action_value: '',
    priority: 5,
    is_active: true,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getBehaviorRules();
    setRules(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.rule_name || !form.action_value) return;
    const created = await createBehaviorRule(form);
    if (created) {
      setRules(prev => [created, ...prev]);
      setForm({ rule_name: '', condition_field: 'energy', condition_operator: 'lt', condition_value: 30, action_type: 'set_activity', action_value: '', priority: 5, is_active: true });
      setShowForm(false);
    }
  };

  const handleToggle = async (rule: BehaviorRule) => {
    const success = await toggleBehaviorRule(rule.id, !rule.is_active);
    if (success) {
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r));
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteBehaviorRule(id);
    if (success) {
      setRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const getPriorityColor = (p: number) => {
    if (p >= 9) return 'text-red-400 border-red-800 bg-red-950/30';
    if (p >= 7) return 'text-amber-400 border-amber-800 bg-amber-950/30';
    if (p >= 5) return 'text-cyan-400 border-cyan-800 bg-cyan-950/30';
    return 'text-gray-500 border-gray-700 bg-gray-900/30';
  };

  return (
    <div className="bg-black text-cyan-400 font-mono">
      <div className="bg-gradient-to-r from-cyan-950/30 to-black border-b-2 border-cyan-800 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-500" />
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">BEHAVIOR FORGE</h2>
              <p className="text-cyan-700 text-xs">NPC RULE ENGINE • AUTONOMOUS DECISION SYSTEM</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-900 border border-cyan-600 text-cyan-300 hover:bg-cyan-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            NEW RULE
          </button>
        </div>
      </div>

      <div className="p-5">
        {showForm && (
          <div className="bg-gray-950 border-2 border-cyan-700 rounded-lg p-5 mb-6">
            <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              FORGE NEW RULE
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">RULE NAME</label>
                <input
                  value={form.rule_name}
                  onChange={e => setForm({ ...form, rule_name: e.target.value })}
                  placeholder="e.g. Low Energy Rest"
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">PRIORITY (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 5 })}
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">CONDITION FIELD</label>
                <select
                  value={form.condition_field}
                  onChange={e => setForm({ ...form, condition_field: e.target.value })}
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                >
                  {CONDITION_FIELDS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">OPERATOR</label>
                <select
                  value={form.condition_operator}
                  onChange={e => setForm({ ...form, condition_operator: e.target.value })}
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                >
                  {CONDITION_OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">VALUE (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.condition_value}
                  onChange={e => setForm({ ...form, condition_value: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">ACTION TYPE</label>
                <select
                  value={form.action_type}
                  onChange={e => setForm({ ...form, action_type: e.target.value })}
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                >
                  {ACTION_TYPES.map(a => <option key={a} value={a}>{a.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">ACTION VALUE</label>
                <input
                  value={form.action_value}
                  onChange={e => setForm({ ...form, action_value: e.target.value })}
                  placeholder="e.g. sleeping, arcade, rate_content"
                  className="w-full bg-black border border-cyan-800 px-3 py-2 text-cyan-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-cyan-800 hover:bg-cyan-700 text-black font-bold transition-colors"
              >
                FORGE RULE
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-cyan-800 mx-auto mb-3 animate-pulse" />
            <p className="text-cyan-800">LOADING BEHAVIOR RULES...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-3">{rules.length} RULES ACTIVE</div>
            {rules.map(rule => (
              <div
                key={rule.id}
                className={`border rounded p-3 transition-all ${
                  rule.is_active
                    ? 'bg-gray-950 border-cyan-900'
                    : 'bg-black border-gray-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 border rounded font-bold shrink-0 ${getPriorityColor(rule.priority)}`}>
                      P{rule.priority} {PRIORITY_LABELS[rule.priority]}
                    </span>
                    <div className="min-w-0">
                      <div className="text-cyan-300 font-bold text-sm">{rule.rule_name}</div>
                      <div className="text-gray-600 text-xs mt-0.5">
                        IF <span className="text-amber-400">{rule.condition_field}</span>{' '}
                        <span className="text-gray-400">{rule.condition_operator}</span>{' '}
                        <span className="text-amber-400">{rule.condition_value}</span>{' '}
                        THEN <span className="text-cyan-400">{rule.action_type.replace('_', ' ')}</span>{' → '}
                        <span className="text-green-400">{rule.action_value}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button onClick={() => handleToggle(rule)} className="text-gray-500 hover:text-cyan-400 transition-colors">
                      {rule.is_active
                        ? <ToggleRight className="w-5 h-5 text-cyan-500" />
                        : <ToggleLeft className="w-5 h-5" />
                      }
                    </button>
                    <button onClick={() => handleDelete(rule.id)} className="text-gray-700 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
