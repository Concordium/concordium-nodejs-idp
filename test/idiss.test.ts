import { IdentityIssuer, IdentityProviderInfo, AnonimityRevokersInfo, IdentityObjectRequest, AttributeList, IdentityObject, AnonymityRevocationRecord, InitialAccountData, GlobalContext, IdentityObjectRequestV1, IdentityRecoveryRequest, IdentityObjectV1 } from ".."
import * as fs from "fs";
import * as path from "path";


const getIpPrivateKey= async ()=>{
    return await "97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb80000001e3ddc35873616ff573bbeb732c87c5f54bb61f752eb7955bab33699a183aab9cb01d5ca2a1ddac854996a6f2766fc125f86f9abd7271c23a649c93cbf59c5fda34d84d3461131b8e872a2614cfa77120605f3ada3de490b05db710af3fc9924491f5ba8298a26af94945ed49fec133e6234b2ce91e022e1fb6cb71093b3df3b321d8778a06e09c5b9ad8ca30b514c7726cf0c4fca0cf50ea96b4544d8a4026c3a4f57c86bf423bc01e2242e2d8d91db3741afa3a2b81d95cd3791ed2b58e51ee94d27b3d2023a791a3cfd32ad3d9faa5e2a7a1032152ece09fca67a045f48a75764bd25f9a03fb0bb7f647a839e69b74ebaa101e1c3046cb5010014401238ca135e8cc16d1fb6372340c006785b255614cb3f82a315cca947a71b8969eb2a73fd0d95bb0f4346af7baf5ee7915974ab61ff7e7ce7e23d349cd5681502685e9fa16e2ad12a1538f927f1d506442ce10bfc8d340b25f11588f884e49a85e8b9917866014ab2a41ecd5cbaf835d2147bc7c4b20c9e6388c8b033793434a06677bdc4736c1b1fa7b52940dcb8af4c800b705a47b15be05aa76ee7f9d4c160341f9ad05a2717ecd6a3aa9c7139ef75a166ec7a709326e61b1db366c67ffc8aa598e8fc171a728ba35f2c1930fb2d0b96880e2936657eb7f1557be90240de3d7932253f577864eaa70080874474602c653e4b56c14f58fbd66a50ae082651424437f9585943d66e12d3c7e830f971f2c80b4f170b3e0eb3667cbb88867d6ebde73a7c0f1d0ac27987a709c2c6e555bafefbd53ba8b144d5b2fb4c06d58a170a25f539720025b7f7cec1191e8c49f7ab8c3cf026054fadcbd5c160bec73bcf1671dc762b18dc2c0c120b4f07cc3c51260d746668b0ebb339b0d31af0d7f1bf171598d232043fc249e75a8d62f30eb014d734818de7cd9a3d8b806a7d6a5712c66af33b3f1f29d8da3875ce34e8e52a69c8be86cfcdc81888391cefc265cc7266d6c14baf4c9a45e0f29f11a609e96e359144b6f00723d346c1bb34c4e0c05fc21d238a2e3d561d7b36218dedfa1ee9a3530ff348d79017ce46956c11d0b4e60b8b7feb5a59b960ee8a697138d4f9930bd18a22939c81e0f6b2d5efec7d8e5c922d19482e2cbf992e8c073aa604682c4f68272d8f955d8147493d31dacfda50b2b47c35bc5cd5af66323a18ceb907a277e0aa7f96a82c5ab8cc54effee511d2090b73c4b266d907ca8d94bf73101a445a6c1d53657a75d8498ef68bb99d2b34ce61bacae9266742ef5ccd7aab3c1a60d5a9626a8fccaf91d2e1f54169e01262b280bcf51301a8acf5d4a8c66214e6a6376b6fd474ab8ea036ca45efc6a372446870f03def10b4e03ae9f0a2b1d1b9e27839ee7efccbd2614b1ec761308c4f4c677cf504f4"
};

const getIpCdiPrivateKey= async ()=>{
    return await "0df011d9bb50f3032f0376bf7c93c61ef3d60719bc3305249b4cfdf0e64d59ef"
};


describe("IdentityIssuer", ()=>{

    let idiss: IdentityIssuer;

    beforeAll(()=>{
        const global: GlobalContext = JSON.parse(fs.readFileSync(path.join(__dirname,'global.json'), 'utf8'));
        const ip_info:IdentityProviderInfo = JSON.parse(fs.readFileSync(path.join(__dirname,'ip_info.json'), 'utf8'))
        const ars_info:AnonimityRevokersInfo = JSON.parse(fs.readFileSync(path.join(__dirname,'ars_info.json'), 'utf8'))
        idiss=new IdentityIssuer(global, ip_info, ars_info,getIpPrivateKey, getIpCdiPrivateKey)
    })

    describe("validateIdentityObjectRequest", () => {
        test('valid id request', () => {
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-id_request.json'), 'utf8')) as IdentityObjectRequest
            const res = idiss.validateIdentityObjectRequest(identityObjectRequest);
            console.log(res)
            expect(res).toBeTruthy()
        })

        test('invalid id request', () => {
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'invalid-id_request.json'), 'utf8')) as IdentityObjectRequest
            expect(() => {idiss.validateIdentityObjectRequest(identityObjectRequest)}).toThrowError("Validation failed: Ip validation failed: IncorrectProof")
        })

        test('bad(type) id request', () => {
            try{
                const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'bad_type-id_request.json'), 'utf8')) as IdentityObjectRequest
                const res = idiss.validateIdentityObjectRequest(identityObjectRequest);
                fail();
            }catch(err){
                expect(err).toBeDefined();
            }
        })
    })

    describe("validateIdentityObjectRequestV1", () => {
        test('valid id request', () => {
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-id_request_v1.json'), 'utf8')) as IdentityObjectRequestV1
            const res = idiss.validateIdentityObjectRequestV1(identityObjectRequest);
            expect(res).toBeUndefined()
        })

        test('invalid id request', () => {
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'invalid-id_request_v1.json'), 'utf8')) as IdentityObjectRequestV1
            expect(() => {idiss.validateIdentityObjectRequestV1(identityObjectRequest)}).toThrow("Validation failed: Ip validation failed: WrongArParameters")
        })

        test('bad(type) id request', () => {
            try{
                const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'bad_type-id_request.json'), 'utf8')) as IdentityObjectRequestV1
                const res = idiss.validateIdentityObjectRequestV1(identityObjectRequest);
                fail();
            }catch(err){
                expect(err).toBeDefined();
            }
        })
    })

    describe("validateRecoveryRequest", () => {
        test('valid recovery request', () => {
            const recoveryRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-recovery_request.json'), 'utf8')) as IdentityRecoveryRequest;
            const res = idiss.validateIdentityRecoveryRequest(recoveryRequest, 1660140839);
            expect(res).toBeUndefined()
        })

        test('invalid recovery request', () => {
            const recoveryRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'invalid-recovery_request.json'), 'utf8')) as IdentityRecoveryRequest;
            expect(() => {idiss.validateIdentityRecoveryRequest(recoveryRequest, 1660140839)}).toThrow("Identity recovery validation failed: Invalid ID ownership proof.")
        })

        test('request too early', () => {
            const recoveryRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'invalid-recovery_request.json'), 'utf8')) as IdentityRecoveryRequest;
            expect(() => {idiss.validateIdentityRecoveryRequest(recoveryRequest, 1660140839 - 61)}).toThrow("Identity recovery request is not current enough.")
        })

        test('request too late', () => {
            const recoveryRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'invalid-recovery_request.json'), 'utf8')) as IdentityRecoveryRequest;
            expect(() => {idiss.validateIdentityRecoveryRequest(recoveryRequest, 1660140839 + 61)}).toThrow("Identity recovery request is not current enough.")
        })
    })

    describe("validateAttributeListType",()=>{
        test('valid attribute list', ()=>{
            const attributeList=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-attributes.json'), 'utf8')) as AttributeList
            expect(idiss.validateAttributeListType(attributeList)).toBeTruthy()
        })

        test('bad(type) attribute list', ()=>{
            try{
                const attributeList=JSON.parse(fs.readFileSync(path.join(__dirname,'bad-attributes.json'), 'utf8')) as AttributeList
                const res :AttributeList= idiss.validateAttributeListType(attributeList);
                fail();
            }catch(err){
                expect(err).toBeDefined();
            }
        })

        test('min attribute list', ()=>{
            const attributeList: AttributeList={
                chosenAttributes:{},
                createdAt: "202004",
                maxAccounts: 238,
                validTo: "202104"
            }
            expect(idiss.validateAttributeListType(attributeList)).toBeTruthy()
        })
    })

    describe("createIdentityObject",()=>{

        test("direct usage",async (done)=>{
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-id_request.json'), 'utf8')) as IdentityObjectRequest
            const attributeList=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-attributes.json'), 'utf8')) as AttributeList
            const expiry = 12346546 // expiry of the account creation transaction that will be sent to the chain
            const [identityObject, anonymityRevocationRecord, initialAccount]: [IdentityObject, AnonymityRevocationRecord, InitialAccountData] = await idiss.createIdentityObject(identityObjectRequest,attributeList, expiry);

            expect(identityObject).toBeDefined()
            expect(identityObject.value.preIdentityObject).toEqual(identityObjectRequest.idObjectRequest.value)
            expect(identityObject.value.attributeList).toEqual(attributeList)
            expect(identityObject.value.signature).toBeDefined()

            expect(anonymityRevocationRecord).toBeDefined()
            expect(anonymityRevocationRecord.value.arData).toEqual(identityObjectRequest.idObjectRequest.value.ipArData)
            expect(anonymityRevocationRecord.value.idCredPub).toEqual(identityObjectRequest.idObjectRequest.value.pubInfoForIp.idCredPub)
            done()
        })
    })

    describe("createIdentityObjectV1",()=>{

        test("direct usage",async (done)=>{
            const identityObjectRequest=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-id_request_v1.json'), 'utf8')) as IdentityObjectRequestV1
            const attributeList=JSON.parse(fs.readFileSync(path.join(__dirname,'valid-attributes.json'), 'utf8')) as AttributeList
            const [identityObject, anonymityRevocationRecord]: [IdentityObjectV1, AnonymityRevocationRecord] = await idiss.createIdentityObjectV1(identityObjectRequest,attributeList);

            expect(identityObject).toBeDefined()
            expect(identityObject.value.preIdentityObject).toEqual(identityObjectRequest.idObjectRequest.value)
            expect(identityObject.value.attributeList).toEqual(attributeList)
            expect(identityObject.value.signature).toBeDefined()

            expect(anonymityRevocationRecord).toBeDefined()
            expect(anonymityRevocationRecord.value.arData).toEqual(identityObjectRequest.idObjectRequest.value.ipArData)
            expect(anonymityRevocationRecord.value.idCredPub).toEqual(identityObjectRequest.idObjectRequest.value.idCredPub)
            done()
        })
    })
})
