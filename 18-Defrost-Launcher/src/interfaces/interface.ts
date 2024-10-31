import { Launchpad, Project } from "@prisma/client";

export type ProjectStatus = "ended" | "upcoming" | "pending";

export interface DBProject extends Project {
    // id: number;
    // projectID: string;
    // projectName: string;
    // projectOwnerAddress: string;
    // description: string;
    // shortDescription: string;
    // projectImageUrls: string[];
    // txnHashCreated: string;
    // projectTitle: string;
    // projectLogoImageUrl: string[];
    // endDate: Date;
    // startDate: Date;
    // status: Status;
    raisedAmount?: string; // bigint as string
    isProjectSoftcapReached?: boolean;
    isProjectFullyToppedUp?: boolean;
    status?: ProjectStatus;
    hardCap?: string;
    softCap?: string;
    rewardRate?: string;
    isRedeemed?: boolean;
}

export interface DBLaunchpad extends Launchpad { }
