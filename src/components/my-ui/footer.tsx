import { Stack, HStack, Link, Image, IconButton, LinkProps } from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const links = ['Blog', 'Documentation', 'Terms of use', 'Privacy policy'];
const accounts = [
    {
        url: 'https://github.com/tientu2003/ielts-front-end',
        label: 'Github Account',
        type: 'gray',
        icon: <FaGithub />
    },
    {
        url: 'https://www.linkedin.com/in/ti%E1%BA%BFn-t%C3%BA-nguy%E1%BB%85n-b389b2328/',
        label: 'LinkedIn Account',
        type: 'blue',
        icon: <FaLinkedin />
    }
];

const Footer = () => {
    return (
        <Stack
            maxW="5xl"
            marginInline="auto"
            p={8}
            gap={20}
            justifyContent="space-between"
            alignItems="center"
            direction={{ base: 'column', md: 'row' }}
        >
            <Link href={''} >
                <Image w="200px" src="/assets/logo.png" alt="English Master" />
            </Link>

            {/* Desktop Screen */}
            <HStack  alignItems="center" gap={10}>
                {links.map((link, index) => (
                    <CustomLink key={index}>{link}</CustomLink>
                ))}
            </HStack>


            <Stack direction="row" pt={{ base: 4, md: 0 }} alignItems="center">
                {accounts.map((sc, index) => (
                    <IconButton
                        key={index}
                        variant={'subtle'}
                        colorPalette={sc.type}
                        rounded="md"
                    >
                        <Link href={sc.url}>
                            {sc.icon}
                        </Link>
                    </IconButton>
                ))}
            </Stack>
        </Stack>
    );
};

const CustomLink = ({ children, ...props }: LinkProps) => {
    return (
        <Link href="#" fontSize="sm" _hover={{ textDecoration: 'underline' }} {...props}>
            {children}
        </Link>
    );
};

export default Footer;