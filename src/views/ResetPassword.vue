<template>
  <section class="mx-auto" style="max-width:560px;">
    <h2 class="h4 mb-3">Reset Password</h2>
    <div class="card"><div class="card-body">
      <p v-if="info" class="text-success small">{{ info }}</p>
      <p v-if="error" class="text-danger small">{{ error }}</p>

      <form @submit.prevent="send" class="row g-3" novalidate>
        <div class="col-12">
          <label for="rp" class="form-label">Email</label>
          <input id="rp" v-model.trim="email" type="email" class="form-control">
        </div>
        <div class="col-12 d-grid">
          <button class="btn btn-primary" type="submit">Send reset link</button>
        </div>
      </form>
    </div></div>
  </section>
</template>

<script>
export default {
  name: 'ResetPassword',
  data(){ return { email:'', info:'', error:'' } },
  methods:{
    send(){
      this.info=''; this.error='';
      if(!this.email || !this.email.includes('@')){
        this.error='Please enter a valid email';
        return;
      }
      // demo only
      this.info='If this email exists, a reset link has been sent.';
    }
  }
}
</script>
