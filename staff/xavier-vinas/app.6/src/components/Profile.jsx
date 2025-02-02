import UpdateUserPassword from './UpdateUserPassword'
import UpdateUserEmail from './UpdateUserEmail'
import UnregisterUser from './UnregisterUser'
import Container from '../library/Container'

function Profile({ onUnregisterUser }) {
   

    return <Container className="gap-5">
        <UpdateUserPassword />
        <UpdateUserEmail />
        <UnregisterUser onUnregisterUser={onUnregisterUser} />
    </Container>
}

export default Profile