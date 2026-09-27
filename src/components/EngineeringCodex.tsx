import React, { useState } from 'react';
import { BookOpen, Layers, Shield, Code, Sparkles, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { TECHNICAL_MODULES_16, ANCIENT_MODERN_MATRIX } from '../data/chaptersData';
import { sound } from '../utils/audio';

export const EngineeringCodex: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'ancient-modern' | 'challenges' | 'code-vault'>('modules');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (id: string, text: string) => {
    sound.playClank();
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const CODE_SNIPPETS = [
    {
      id: 'objectarx',
      title: 'Autodesk ObjectARX C++ Kinematics & Emergency Retract',
      language: 'cpp',
      code: `// System Operating States
enum class SystemState {
  IDLE,
  UTILITIES_ACTIVE,
  SAMPLING_IN_PROGRESS,
  RETRACTING,
  EMERGENCY_STOP
};

void AutonomousSamplingSystem::ProcessControlSignals(bool remote_button, const std::string& telemetry_status) {
  if (telemetry_status == "SLAG_BLOCKAGE_DETECTED") {
    ExecuteEmergencyRetract();
    return;
  }
  if (current_state == SystemState::EMERGENCY_STOP) {
    if (telemetry_status == "SYSTEM_RESET") {
      current_state = SystemState::IDLE;
      return;
    }
    return; // Lockout active
  }
  if (remote_button || telemetry_status == "CAST_CYCLE_READY") {
    ActivateUtilitySystems();
    current_state = SystemState::SAMPLING_IN_PROGRESS;
    UpdateCADPositionSmooth(gantry_x, 3250.0, 5);
    UpdateCADPositionSmooth(telescopic_z, 1850.0, 5);
    // Immersion sequence...
    current_state = SystemState::RETRACTING;
    UpdateCADPositionSmooth(telescopic_z, 0.0, 3);
    UpdateCADPositionSmooth(gantry_x, 0.0, 3);
    DeactivateUtilitySystems();
    current_state = SystemState::IDLE;
  }
}`
    },
    {
      id: 'fastapi',
      title: 'FastAPI v3 Edge Server with Atomic .tmp Disk Failover',
      language: 'python',
      code: `def _upload_to_s3_or_disk_sync(payload: Dict[str, Any]):
    filename = f"frame_{uuid.uuid4().hex}.json"
    serialized_bytes = json.dumps(payload).encode('utf-8')
    s3_key = f"live-ingest/{payload['device_id']}/{filename}"
    try:
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET,
            Key=s3_key,
            Body=serialized_bytes,
            ContentType="application/json"
        )
    except (ClientError, Exception) as cloud_err:
        # Atomic local file write sequence prevents race conditions during daemon reads
        tmp_path = os.path.join(LOCAL_BACKUP_DIR, f"{filename}.tmp")
        final_path = os.path.join(LOCAL_BACKUP_DIR, filename)
        with open(tmp_path, 'wb') as backup_file:
            backup_file.write(serialized_bytes)
            backup_file.flush()
            os.fsync(backup_file.fileno())
        os.replace(tmp_path, final_path)`
    },
    {
      id: 'cipher',
      title: 'Lightweight Industrial AES-256-GCM Data Cipher',
      language: 'python',
      code: `class SecureCloudStorageManager:
    def encrypt_payload(self, raw_data_dict: dict) -> dict:
        """Encrypts JSON payloads using AES-256-GCM authenticated encryption."""
        json_bytes = json.dumps(raw_data_dict).encode('utf-8')
        nonce = get_random_bytes(12)  # Standard 96-bit GCM nonce
        cipher = AES.new(self.secret_key, AES.MODE_GCM, nonce=nonce)
        ciphertext, tag = cipher.encrypt_and_digest(json_bytes)
        return {
            "nonce": nonce.hex(),
            "ciphertext": ciphertext.hex(),
            "tag": tag.hex()
        }`
    },
    {
      id: 'cloudformation',
      title: 'AWS CloudFormation Immutable S3 & KMS Telemetry Architecture',
      language: 'yaml',
      code: `KuduaTelemetryS3Bucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub "kudua-furnace-telemetry-archive-\${EnvironmentName}-\${AWS::AccountId}"
    OwnershipControls:
      Rules:
        - ObjectOwnership: BucketOwnerEnforced
    PublicAccessBlockConfiguration:
      BlockPublicAcls: true
      BlockPublicPolicy: true
      IgnorePublicAcls: true
      RestrictPublicBuckets: true
    BucketEncryption:
      ServerSideEncryptionConfiguration:
        - ServerSideEncryptionByDefault:
            SSEAlgorithm: "aws:kms"
            KMSMasterKeyID: !Ref KuduaTelemetryKmsKey
    LifecycleConfiguration:
      Rules:
        - Id: DeepArchiveOldTelemetryFrames
          Status: Enabled
          Transitions:
            - TransitionInDays: 90
              StorageClass: GLACIER`
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <span>ENGINEERING CODEX & ARCHITECTURAL ARCHIVE</span>
            <span>·</span>
            <span>TATA INNOVERSE COMPENDIUM</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-epic text-stone-100 mt-1">
            Technical Architecture Matrix
          </h1>
          <p className="text-xs sm:text-sm font-body text-stone-400 mt-1">
            Exhaustive breakdown of the 16 functional modules, Ancient Bhartiya metallurgical mappings, and production-hardened source code.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg flex-wrap">
          <button
            onClick={() => { sound.playClank(); setActiveTab('modules'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              activeTab === 'modules' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            16 Modules
          </button>
          <button
            onClick={() => { sound.playClank(); setActiveTab('ancient-modern'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              activeTab === 'ancient-modern' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Ancient vs Modern
          </button>
          <button
            onClick={() => { sound.playClank(); setActiveTab('challenges'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              activeTab === 'challenges' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Tata Challenges
          </button>
          <button
            onClick={() => { sound.playClank(); setActiveTab('code-vault'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              activeTab === 'code-vault' ? 'bg-amber-500 text-black font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Code Vault
          </button>
        </div>
      </div>

      {/* Tab Content: 16 Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECHNICAL_MODULES_16.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-amber-500 font-bold">Module {m.id.toString().padStart(2, '0')}</span>
                  <span className="text-stone-500 uppercase text-[10px]">{m.category}</span>
                </div>
                <h3 className="text-sm font-semibold font-body text-stone-200 mb-1.5">
                  {m.title}
                </h3>
                <p className="text-xs font-body text-stone-400 leading-relaxed">
                  {m.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Ancient Bhartiya vs Modern Technology */}
      {activeTab === 'ancient-modern' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl border-t border-b border-r border-stone-800 text-xs sm:text-sm font-body text-stone-300 leading-relaxed">
            Ancient Bhartiya metallurgists forged the legendary Wootz steel and Delhi Iron Pillar using thermodynamic principles that modern engineering is rediscovering today. By integrating traditional geometries like the Kudua stack and Vajra-lepa nano-bonding with robotics, we achieve unprecedented durability.
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-left text-xs font-body divide-y divide-stone-800">
              <thead className="bg-stone-900 text-stone-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3.5">Ancient Concept</th>
                  <th className="p-3.5">Historical Source</th>
                  <th className="p-3.5">Modern Implementation</th>
                  <th className="p-3.5">Engineered Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 bg-stone-950/70 text-stone-300">
                {ANCIENT_MODERN_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-3.5 font-semibold text-amber-400">{item.ancientTech}</td>
                    <td className="p-3.5 text-stone-400 italic">{item.source}</td>
                    <td className="p-3.5 font-mono text-cyan-400">{item.modernImplementation}</td>
                    <td className="p-3.5 text-stone-300">{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Tata InnoVerse Challenge Alignment */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col gap-3">
            <span className="text-xs font-mono text-amber-500 font-semibold uppercase">
              Tata InnoVerse Challenge #1
            </span>
            <h3 className="text-xl font-bold font-epic text-stone-100">
              Slag Pot Crack Detection
            </h3>
            <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
              <span>Closing Date: 13-10-2026</span>
              <span>·</span>
              <span className="text-emerald-400">Addressed by Module 7 & 10</span>
            </div>
            <p className="text-sm font-body text-stone-300 leading-relaxed">
              Automated, non-contact detection of cracks caused by extreme thermal cycling in steel plants. Currently reliant on subjective manual inspection, resulting in catastrophic molten breakouts.
            </p>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-body text-cyan-300">
              <strong>Kudua Solution:</strong> High-speed infrared sensor fusion and SHAP-explainable computer vision edge models detecting thermal micro-cracking prior to ladle transport.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col gap-3">
            <span className="text-xs font-mono text-amber-500 font-semibold uppercase">
              Tata InnoVerse Challenge #2
            </span>
            <h3 className="text-xl font-bold font-epic text-stone-100">
              Automated Scotching for Torpedo Ladles
            </h3>
            <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
              <span>High-Temp Rail Operations</span>
              <span>·</span>
              <span className="text-emerald-400">Addressed by Module 4 & 12</span>
            </div>
            <p className="text-sm font-body text-stone-300 leading-relaxed">
              Eliminating the danger of operators manually wedging wooden scotch blocks beneath 400-ton torpedo ladles carrying 1450°C iron along slippery tracks with radiant heat up to 250°C.
            </p>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-body text-amber-300">
              <strong>Kudua Solution:</strong> Self-powered, remote-operated pneumatic mechanical scotch blocks powered by subterranean UEPSS energy harvesting.
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Code Vault */}
      {activeTab === 'code-vault' && (
        <div className="flex flex-col gap-6">
          {CODE_SNIPPETS.map((snip) => (
            <div
              key={snip.id}
              className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-stone-200">
                    {snip.title}
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">
                    Language: {snip.language}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(snip.id, snip.code)}
                  className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copiedCodeId === snip.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeId === snip.id ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-black/90 rounded-xl border border-stone-800/80 overflow-x-auto text-xs font-mono text-stone-300 leading-relaxed">
                <code>{snip.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
