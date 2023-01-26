import { useContext, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useToast,
} from '@chakra-ui/react';

// context
import { StateContext } from '../../state/StateContext';

// api
import api from '../../api';

function Login() {
  const { authService } = useContext(StateContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { idToken } = await api.auth.logIn(formData);
      authService.send({ type: 'LOG_IN', idToken });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} w="md">
        <Stack align="center">
          <Heading fontSize="4xl">VFD Status Admin</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>User name</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  isRequired
                  isDisabled={isLoading}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  isRequired
                  isDisabled={isLoading}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  type="submit"
                  bg="purple.400"
                  color="white"
                  _hover={{
                    bg: 'purple.500',
                  }}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Log in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
