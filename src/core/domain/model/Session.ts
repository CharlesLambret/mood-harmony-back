import { DomainModel } from '../../base/domain-model';
import { SessionPhase } from './SessionPhase';

export class Session extends DomainModel {
    userId: number;
    duration: number;
    fromEmotionId: number;
    toEmotionId: number;
    phases: SessionPhase[];
    updatedAt: Date;
    createdAt: Date;

    startBpm: number;
    targetBpm: number;
    startEnergy: number;
    targetEnergy: number;
    startSpeechiness: number;
    targetSpeechiness: number;

    constructor(
        id: string,
        userId: number,
        duration: number,
        fromEmotionId: number,
        toEmotionId: number,
        phases: SessionPhase[] = [],
        updatedAt?: Date,
        createdAt?: Date,
        startBpm?: number,
        targetBpm?: number,
        startEnergy?: number,
        targetEnergy?: number,
        startSpeechiness?: number,
        targetSpeechiness?: number,
    ) {
        super(id);

        if (!userId) {
            throw new Error('User ID is required');
        }

        if (duration <= 0) {
            throw new Error('Duration must be greater than 0');
        }

        if (!fromEmotionId) {
            throw new Error('From emotion ID is required');
        }

        if (!toEmotionId) {
            throw new Error('To emotion ID is required');
        }

        this.userId = userId;
        this.duration = duration;
        this.fromEmotionId = fromEmotionId;
        this.toEmotionId = toEmotionId;
        this.phases = phases;
        this.updatedAt = updatedAt || new Date();
        this.createdAt = createdAt || new Date();

        this.startBpm = startBpm ?? 0;
        this.targetBpm = targetBpm ?? 0;
        this.startEnergy = startEnergy ?? 0;
        this.targetEnergy = targetEnergy ?? 0;
        this.startSpeechiness = startSpeechiness ?? 0;
        this.targetSpeechiness = targetSpeechiness ?? 0;
    }

    get totalDuration(): number {
        return this.phases.reduce((sum, phase) => sum + phase.actualDuration, 0);
    }

    get numberOfPhases(): number {
        return this.phases.length;
    }

    get allPhases(): SessionPhase[] {
        return this.phases;
    }

    addPhase(phase: SessionPhase): void {
        if (phase.sessionId !== this.id) {
            throw new Error('Phase session ID must match session ID');
        }
        this.phases.push(phase);
    }

    getPhase(phaseNumber: number): SessionPhase | undefined {
        return this.phases.find(phase => phase.phaseNumber === phaseNumber);
    }
}
