import ThreeDotIcon from "@/asset/icon/ThreeDotIcon";
import { Button, Divider, Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Dropdown, DropdownSection, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { useRouter } from "next/router";
import { signOut } from 'next-auth/react';
import ProfileIcon from "@/asset/icon/ProfileIcon";
import LogoutIcon from "@/asset/icon/LogoutIcon";

export default function Header() {
    const { data: session } = useSession() || {};
    const router = useRouter();
    const logOut = () => {
        // Sign out and redirect to home page
        signOut({ callbackUrl: '/' });  // Redirect to home page after logout
    }

    return (
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3 text-primary">
                <Image
                    isZoomed
                    width={60}
                    radius="lg"
                    alt="NextUI Fruit Image with Zoom"
                    src={session?.user?.image ?? "/path/to/default/image.jpg"}
                    onClick={() => router.push('/home')}
                />
                <div>
                    <span className="font-bold">{session?.user?.name}</span>
                    <div />
                    <span>Balance:1000$</span>
                </div>
            </div>
            <div>
                <Button isIconOnly variant="light" startContent={<ProfileIcon />} onClick={() => router.push('/profile')}>
                </Button>
                <Button isIconOnly variant="light" startContent={<LogoutIcon />} onClick={()=>logOut()}>
                </Button>
            </div>
           
            {/* <Dropdown className="bg-white text-primary">
                <DropdownTrigger>
                    <Button isIconOnly variant="light" startContent={<ThreeDotIcon />}>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions"
                    className="border-primary"
                    variant="flat"
                    itemClasses={{
                        base: [
                            "text-primary",
                            "transition-opacity",
                            "data-[hover=true]:text-white",
                            "data-[hover=true]:bg-primary",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    }}>
                    <DropdownSection>
                        <DropdownItem key="profile" color="primary" className="h-10 my-2">
                            <p className="font-bold">Signed in as</p>
                            <p className="font-bold">{session?.user?.name}</p>
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection aria-label="Preferences">
                        <DropdownItem key="settings" color="primary" onClick={() => router.push('/home')}>
                            <hr className="bg-primary" />
                        </DropdownItem>
                        <DropdownItem key="settings" color="primary" onClick={() => router.push('/home')}>
                            Home
                        </DropdownItem>
                        <DropdownItem key="team_settings" color="primary" onClick={() => router.push('/profile')}>Profile</DropdownItem>
                        <DropdownItem key="help_and_feedback" color="primary" onClick={() => router.push('/policy')}>
                            Term and Service
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection aria-label="Preferences">
                        <DropdownItem key="settings" color="primary" onClick={() => router.push('/home')}>
                            <hr className="bg-primary" />
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={() => logOut()}>
                            Log Out
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown> */}
        </div>
    )
}