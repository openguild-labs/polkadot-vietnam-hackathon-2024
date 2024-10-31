export interface AbstractEntity {
  id: string;
  createAt: Date;
  updateAt: Date;
}

export interface AccountEntity extends AbstractEntity {
  username: string;
  hashedPassword: string;
  roles?: Array<Role>;
}

export interface RoleEntity extends AbstractEntity {
  role: Role;
  accountId: string;
  account: AccountEntity;
}

export enum Role {
  //admin is the highest role
  Admin = "admin",
  //minter is the role that can mint nfts
  NftMinter = "nft-minter",
  //updater is the role that can update nfts
  NftUpdater = "nft-updater",
  //burner is the role that can burn nfts
  NftBurner = "nft-burner",
  //token-minter is the role that can mint tokens
  TokenMinter = "token-minter",
  //token-burner is the role that can burn tokens
  TokenBurner = "token-burner",
  //game-manger is the role that can manage games
  GameManager = "game-updater",
}

export interface GameVersionEntity extends AbstractEntity {
  version: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface UserEntity extends AbstractEntity {
  telegramId: string;
  username: string;
}
