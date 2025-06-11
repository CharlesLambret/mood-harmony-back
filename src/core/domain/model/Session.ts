import { DomainModel } from '../../base/domain-model';
import { SessionPhase } from './SessionPhase';
import {Emotion} from './Emotion';

export class Session extends DomainModel {
    userEmotionalProfileId: number;
    duration: number;
    fromEmotion: Emotion;
    toEmotion: Emotion;
    phases: SessionPhase[];
    updatedAt: Date;
    createdAt: Date;

    constructor(
        id: number,
        userEmotionalProfileId: number,
        duration: number,
        fromEmotion: Emotion,
        toEmotion: Emotion,
        phases: SessionPhase[] = [],
        updatedAt?: Date,
        createdAt?: Date,

    ) {
        super(id);

        if (!userEmotionalProfileId) {
            throw new Error('User ID is required');
        }

        if (duration <= 0) {
            throw new Error('Duration must be greater than 0');
        }

        if (!fromEmotion) {
            throw new Error('From emotion ID is required');
        }

        if (!toEmotion) {
            throw new Error('To emotion ID is required');
        }

        this.userEmotionalProfileId = userEmotionalProfileId;
        this.duration = duration;
        this.fromEmotion = fromEmotion;
        this.toEmotion = toEmotion;
        this.phases = phases;
        this.updatedAt = updatedAt || new Date();
        this.createdAt = createdAt || new Date();

        
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
