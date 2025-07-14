import polar from '@/lib/actions/get-polar'
//f576580a-9625-4fbe-9694-07db6141d762

const Page = async () => {

    const id = (await polar.customers.getExternal({ externalId: "f576580a-9625-4fbe-9694-07db6141d762" })).id
    console.log(id);

    const state = await polar.customers.getState({ id })

    const meter = state.activeMeters



    return (
        <div>{JSON.stringify(state, null, 4)}</div>
    )
}

export default Page